import React, { useEffect, useState } from "react";
import "../styles/Register.scss";
import {useNavigate} from "react-router-dom"

const RegisterPage = () => {
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      [name]: name === "profileImage" ? files[0] : value,
    });
  };


console.log(formData)
const [passwordMatch, setPasswordMatch] = useState(true);

useEffect(() => {
  setPasswordMatch(formData.password === formData.confirmPassword || formData.password === "");
})
const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    
      try{
        const register_form = new FormData();

        for(var key in formData){
          register_form.append(key,formData[key])
        }
        const response = await fetch("http://localhost:3001/auth/register",{
          method:"POST",
          body:register_form
        })

        if (response.ok){
          navigate("/login")
        }

      }catch(err){
        console.log("Registration failed",err.message)
      }
    
  }





  return (
    <div className="register">
      <div className="register_content">
        <form className="register_content_form" onSubmit={handleSubmit}>
          <input
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Email"
            name="email"
            type="email"
            onChange={handleChange}
            value={formData.email}
            required
          />
          <input
            placeholder="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          


          <input
            placeholder="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {!passwordMatch && (<p style={{color:"red"}}>Passwords are not matched!</p>)}

          <input
            id="image"
            type="file"
            name="profileImage"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChange}
            required
          />

          <label htmlFor="image">
            <img src="/assets/addphoto.jpeg" alt="add profile photo" />
            <p>Upload Your Photo</p>
          </label>
{formData.profileImage &&(<img src={URL.createObjectURL(formData.profileImage)} alt="profile photo" style={{maxWidth:"80px"}}/>)}


          <button type="submit" disabled={!passwordMatch}>REGISTER</button>
        </form>
        <a href="/login">Already have an account? Log In Here</a>
      </div>
    </div>
  );
};

export default RegisterPage;
