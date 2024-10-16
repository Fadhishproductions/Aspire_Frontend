import {useNavigate } from "react-router-dom";
import { Form, Button, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useUpdateUserMutation } from "../../slices/userApiSlice";
import { setCredentials } from "../../slices/authSlice";
import { toast } from "react-toastify";
import FormContainer from "../../components/FormContainer";
import ConfirmationBox from "../../components/ConfirmationBox";
import {handleImageUpload} from '../../Utils/uploadMedia'
import StudentLayout from "../../components/StudentComponents/StudentLayout";
import { FaEye, FaEyeSlash } from "react-icons/fa";
function PasswordModal({
  show,
  handleClose,
  password,
  confirmPassword,
  setPassword,
  setConfirmpassword,
  handleUpdate,
}) {

  const [showPassword, setShowPassword] = useState(false); // State for password visibility toggle
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility toggle

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const validatePassword = () => {

    if(!password || ! confirmPassword){
      toast.error(
        "Password and confirm password is required"
      );
      return false;
    }

    if (
      (password.length < 6 ||
        !/\d/.test(password) ||
        !/[!@#$%^&*(),.?":{}|<>]/.test(password))
    ) {
      toast.error(
        "Password must be at least 6 characters long and contain at least one number and one special character."
      );
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    return true;
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    handleUpdate();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submitHandler}>
          <Form.Group className="my-2" controlId="password">
            <Form.Label>Password</Form.Label>
            <div className="input-group">
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                variant="outline-secondary"
                onClick={togglePasswordVisibility}
                style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
              </div>
          </Form.Group>

          <Form.Group className="my-2" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <div className="input-group">
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmpassword(e.target.value)}
              />
              <Button
                variant="outline-secondary"
                onClick={toggleConfirmPasswordVisibility}
                style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </div>
          </Form.Group>

          <Button type="submit" variant="primary" className="mt-3">
            Update Password
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

function ProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmpassword] = useState("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // For disabling the update button
  const [isEditing, setIsEditing] = useState(false); // New state for Edit/Cancel button

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [update, { isLoading }] = useUpdateUserMutation();

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
    if (userInfo.imageUrl) {
      setImageUrl(userInfo.imageUrl);
    }
  }, [userInfo]);

  useEffect(() => {
    checkIfFormChanged();
  }, [name, email, password, confirmPassword, image]);

  // Function to check if form data has changed or is invalid
  const checkIfFormChanged = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedUserInfoName = userInfo.name.trim();
    const trimmedUserInfoEmail = userInfo.email.trim();

    const isNameChanged = trimmedName !== trimmedUserInfoName;
    const isEmailChanged = trimmedEmail !== trimmedUserInfoEmail;
    const isImageChanged = !!image;

    // Enable the button only if there's a change and passwords are valid (if provided)
    const shouldEnableButton =
      isNameChanged || isEmailChanged || isImageChanged;

    setIsButtonDisabled(!shouldEnableButton);
  };

   

  const validateForm = () => {
    if (!name || !email) {
      toast.error("Name and Email are required fields.");
      return false;
    }

    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setShowConfirmation(true);
  };

  const passwordSubmit = async () => {
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setShowConfirmation(false);

    try {
      let imageUrl = "";
      if (image) {
        imageUrl = await handleImageUpload(image);
      }

      const res = await update({
        _id: userInfo._id,
        name,
        email,
        password,
        imageUrl,
      }).unwrap();

      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated");
      setIsEditing(false); 
     } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(
        err?.data?.message ||
          err?.error ||
          "An error occurred while updating the profile"
      );
    }
  };

  const handleClose = () => {
    setShowConfirmation(false);
  };

  const handlePasswordModalClose = () => {
    setShowPasswordModal(false);
    setPassword("");
    setConfirmpassword("");
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setName(userInfo.name); // Revert to original name
    setEmail(userInfo.email); // Revert to original email
    setImageUrl(userInfo.imageUrl); // Revert to original image
  };

  return (
      <StudentLayout>
    <>
      <FormContainer >
        <h1 style={{ display: "flex", justifyContent: "center" }}>
          Update Profile
        </h1>

        <Form onSubmit={submitHandler}>
          <Form.Group className="my-2" controlId="image">
            <img
              alt="Profile"
              width="200px"
              height="200px"
              src={image ? URL.createObjectURL(image) : imageUrl}
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                objectFit: "cover",
                display: "block",
                margin: "0 auto",
                backgroundColor: "grey",
              }}
            />
          </Form.Group>

          <Form.Group className="my-2">
            <div style={{ textAlign: "right" }}>
              <Button
                variant="outline-secondary"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </Button>
            </div>
          </Form.Group>

          <Form.Group className="my-2" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
            />
          </Form.Group>

          <Form.Group className="my-2" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
            />
          </Form.Group>

          {isLoading && <Loader />}
          {!isEditing ? (
            <Button
              variant="outline-secondary"
              onClick={handleEditClick}
              className="mt-3"
            >
              Edit
            </Button>
          ) : (
            <>
              <Form.Group className="my-2" controlId="image">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  disabled={!isEditing}
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="mt-3"
                disabled={isButtonDisabled}
              >
                Update
              </Button>
              <Button
                variant="outline-danger"
                onClick={handleCancelClick}
                className="mt-3 mx-2"
              >
                Cancel
              </Button>
            </>
          )}
        </Form>
      </FormContainer>

      <PasswordModal
        show={showPasswordModal}
        handleClose={handlePasswordModalClose}
        password={password}
        confirmPassword={confirmPassword}
        setPassword={setPassword}
        setConfirmpassword={setConfirmpassword}
        handleUpdate={passwordSubmit}
      />

      <ConfirmationBox
        show={showConfirmation}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        title="Confirm Profile Update"
        message="Are you sure you want to update your profile?"
      />
    </>
      </StudentLayout>
  );
}

export default ProfileScreen;
