import React, { useState } from "react";
import axios from "axios";
import { API_URL, DASHBOARD_URL } from "../../config";

function Signup() {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const url = isLogin ? `${API_URL}/login` : `${API_URL}/signup`;
      const body = isLogin
        ? { username: formData.username, password: formData.password }
        : formData;

      const res = await axios.post(url, body);

      setIsError(false);
      setMessage(res.data.message + ". Taking you to the dashboard...");

      setTimeout(() => {
        window.location.href = `${DASHBOARD_URL}/?user=${encodeURIComponent(
          res.data.user.username
        )}`;
      }, 1000);
    } catch (err) {
      setIsError(true);
      setMessage(
        err.response?.data?.message || "Server not reachable, try again later"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container p-5">
      <div className="row text-center mb-5">
        <h1 className="fs-2">Open a free demat and trading account online</h1>
        <p className="text-muted">
          Start investing brokerage free and join a community of 1.5+ crore
          investors and traders
        </p>
      </div>

      <div className="row align-items-center">
        <div className="col-md-6 p-3">
          <img src="/media/signup.png" alt="Signup" style={{ width: "100%" }} />
        </div>

        <div className="col-md-6 p-5">
          <h2 className="fs-3 mb-2">{isLogin ? "Login" : "Signup now"}</h2>
          <p className="text-muted mb-4">
            {isLogin
              ? "Welcome back! Login to continue to Kite"
              : "Or track your existing application"}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                name="username"
                className="form-control p-2"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            {!isLogin && (
              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  className="form-control p-2"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="mb-3">
              <input
                type="password"
                name="password"
                className="form-control p-2"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>

            {message && (
              <p className={isError ? "text-danger" : "text-success"}>
                {message}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary fs-5 px-5"
              disabled={loading}
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Continue"}
            </button>
          </form>

          <p className="mt-4">
            {isLogin ? "New to Zerodha? " : "Already have an account? "}
            <span
              className="text-primary"
              style={{ cursor: "pointer" }}
              onClick={toggleMode}
            >
              {isLogin ? "Signup" : "Login"}
            </span>
          </p>

          <p className="text-muted" style={{ fontSize: "12px" }}>
            By proceeding, you agree to the Zerodha terms & privacy policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
