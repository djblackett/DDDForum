import {Bounce, toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import React from "react";
import {useNavigate} from "react-router";


// Define the interface for the request payload
interface UserPayload {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
}

function Register() {

  const navigate = useNavigate();
// Function to create a new user
    async function createUser(payload: UserPayload): Promise<void> {
        const url = 'http://localhost:5000/users/new';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                // Handle response errors
                const errorResponse = await response.json()
                toast.error(errorResponse.error);
                console.error(response)
                return
                // throw new Error(`Error: ${response.status} - ${errorRes}`);
            }

            const data = await response.json();
            console.log('User created successfully:', data);
            toast.success("Success! Redirecting home !");

            setTimeout(() => {
                navigate("/");
            }, 3000)

        } catch (error) {
            console.error('Error creating user:', error);
            toast.error(JSON.stringify(error));
            console.log(error)

        }
    }

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()

        const usernameInput = document.getElementById('username') as HTMLInputElement | null;
        const emailInput = document.getElementById('email') as HTMLInputElement | null;
        const firstNameInput = document.getElementById('first-name') as HTMLInputElement | null;
        const lastNameInput = document.getElementById('last-name') as HTMLInputElement | null;

        if (usernameInput && emailInput && firstNameInput && lastNameInput) {
            const payload: UserPayload = {
                username: usernameInput.value,
                email: emailInput.value,
                // password: 'password', // Assuming password is handled separately
                firstName: firstNameInput.value,
                lastName: lastNameInput.value,
            };

            await createUser(payload);
        } else {
            console.error('One or more form fields are missing.');
        }
    };

    return (
        <>
                <div className="content-container">
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"
                        transition={Bounce}
                    />
                    <form className="registration-form">
                        <div>Create Account</div>
                        <input id="email" className="registration email" type="email" placeholder="email" required/>
                        <input
                            id="username"
                            className="registatation-input username"
                            type="text"
                            placeholder="username"
                            required
                        />
                        <input
                            id="first-name"
                            className="registatation-input username"
                            type="text"
                            placeholder="first name"
                            required
                        />
                        <input
                            id="last-name"
                            className="registatation-input username"
                            type="text"
                            placeholder="last name"
                            required
                        />
                        <div>
                            <div className="to-login">
                                <div>Already have an account?</div>
                                <a href="/login">Login</a>
                            </div>
                            <button className="submit-button button" type="submit" onClick={handleSubmit}>Submit</button>
                        </div>
                    </form>
                </div>
        </>
    )
}

export default Register;