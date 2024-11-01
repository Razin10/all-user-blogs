import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Grid, Link, Button, Paper, TextField, Typography } from "@mui/material";

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(""); // Reset error message

        try {
            const result = await axios.post("http://localhost:5000/login", { email, password }, { withCredentials: true });

            if (result.data === "Success") {
                const response = await axios.get('http://localhost:5000/user', { withCredentials: true });
                if (response.data.user) {
                    setIsLoggedIn(true);
                    setEmail(""); // Clear email input
                    setPassword(""); // Clear password input
                    navigate("/home", { state: { user: response.data.user } });
                }
            } else {
                setError("Login failed. Please check your credentials.");
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const paperStyle = { padding: "2rem", margin: "100px auto", borderRadius: "1rem", boxShadow: "10px 10px 10px" };
    const heading = { fontSize: "2.5rem", fontWeight: "600" };
    const row = { display: "flex", marginTop: "2rem" };
    const btnStyle = { marginTop: "2rem", fontSize: "1.2rem", fontWeight: "700", backgroundColor: "blue", borderRadius: "0.5rem" };
    const label = { fontWeight: "700" };

    return (
        <div>
            <Grid align="center" className="wrapper">
                <Paper style={paperStyle} sx={{ width: { xs: '80vw', sm: '50vw', md: '40vw', lg: '30vw', xl: '20vw' }, height: { lg: '50vh' } }}>
                    <Typography component="h1" variant="h5" style={heading}>Login</Typography>
                    <form onSubmit={handleLogin}>
                        {error && <Typography color="error">{error}</Typography>}
                        <span style={row}>
                            <TextField
                                sx={{ label: { fontWeight: '700', fontSize: "1.3rem" } }}
                                style={label}
                                label="Email"
                                fullWidth
                                variant="outlined"
                                type="email"
                                placeholder="Enter Email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </span>
                        <span style={row}>
                            <TextField
                                sx={{ label: { fontWeight: '700', fontSize: "1.3rem" } }}
                                label="Password"
                                fullWidth
                                variant="outlined"
                                type="password"
                                placeholder="Enter Password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </span>
                        <Button style={btnStyle} variant="contained" type="submit" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                    <p>dont have an account? <Link href="/signup">SignUp</Link></p>
                </Paper>
            </Grid>
        </div>
    );
}

export default Login;