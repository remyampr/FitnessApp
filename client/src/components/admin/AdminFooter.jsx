import React from "react";

export const AdminFooter = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="footer footer-center p-4 bg-base-300 text-base-content">
      <div>
        <p className="text-sm">
          © {year} Admin Portal. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
