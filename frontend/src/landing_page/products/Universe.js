import React from "react";
import { useNavigate } from "react-router-dom";

const partners = [
  { logo: "/media/zerodhaFundhouse.png", text: "Asset management" },
  { logo: "/media/sensibullLogo.svg", text: "Options trading platform" },
  { logo: "/media/goldenpiLogo.png", text: "Bonds trading platform" },
  { logo: "/media/streakLogo.png", text: "Algo & strategy platform" },
  { logo: "/media/smallcaseLogo.png", text: "Thematic investment platform" },
  { logo: "/media/dittoLogo.png", text: "Insurance" },
];

function Universe() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <div className="row text-center">
        <h1>The Zerodha Universe</h1>
        <p>
          Extend your trading and investment experience even further with our
          partner platforms
        </p>

        {partners.map((partner) => (
          <div className="col-4 p-3 mt-5" key={partner.text}>
            <img
              src={partner.logo}
              alt={partner.text}
              style={{ height: "50px", maxWidth: "70%", objectFit: "contain" }}
            />
            <p className="text-small text-muted mt-3">{partner.text}</p>
          </div>
        ))}

        <button
          className="p-2 btn btn-primary fs-5 mb-5 mt-5"
          style={{ width: "20%", margin: "0 auto" }}
          onClick={() => navigate("/signup")}
        >
          Signup Now
        </button>
      </div>
    </div>
  );
}

export default Universe;
