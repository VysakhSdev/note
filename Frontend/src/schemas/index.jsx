import * as Yup from "yup";

export const signUpSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(25, "Name cannot exceed 25 characters")
    .required("Please enter your name"),
  
 
  email: Yup.string()
    .email("Invalid email format")
    .required("Please enter your email"),
    
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one digit")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .required("Please enter your password"),
    
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

export const signUpInitialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: ""
};

export const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Please enter your email"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .required("Please enter your password"),
});

export const loginInitialValues = {
  email: "",
  password: "",
};
