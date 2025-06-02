import { useState } from "react";
import { useNavigate } from "react-router-dom";

export interface ILoginProps {
  className?: string;
}

export const Login = ({ className, ...props }: ILoginProps): JSX.Element => {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const onLogin = () => {
    console.log(username, password);
    navigate("/dashboard");
  };
  return (
    <div className={`min-h-screen flex items-center justify-center bg-white px-2 ${className}`}>
      <div className="w-full max-w-6xl bg-[#f3f3f3] rounded-3xl shadow-[24px_48px_96px_0_rgba(0,0,0,0.22)] flex flex-row md:flex-row gap-6 overflow-hidden px-6 py-6">
        {/* Left side (logo) */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-white p-8 rounded-2xl">
          <img
            className="w-[36rem] h-[36rem] object-contain mx-auto"
            src="logo-adverse-03-10.png"
            alt="Logo"
          />
        </div>
        {/* Right side (form) */}
        <div className="w-full md:w-1/2 bg-white p-6 md:p-12 flex flex-col justify-start relative rounded-2xl">
          <img
            className="w-48 object-contain mb-6"
            src="logo-adverse-02-10.png"
            alt="Adverse Logo"
          />
          <div className="text-black text-left font-semibold text-2xl md:text-3xl mb-2">Get Started Now</div>
          <div className="text-black/60 text-left text-[12px] font-sfpro mb-6">
            Sign in to view real-time insights, player analytics, and AI reports.
          </div>
          <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
            <div>
              <label className="block text-black font-semibold mb-1" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="workmail@gmail.com"
                className="w-full h-10 rounded-lg border border-ui-colors-blue px-4 text-base focus:outline-none focus:border-blue-600 focus:border-2 focus:ring-0 hover:shadow-lg"
              />
            </div>
            <div>
              <label className="block text-black font-semibold mb-1" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  className="w-full h-10 rounded-lg border border-ui-colors-blue px-4 text-base focus:outline-none focus:border-blue-600 focus:border-2 focus:ring-0 shadow-sm pr-12"
                />
                <img
                  className={`w-6 h-6 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-colors duration-200 ${showPassword ? 'filter' : ''}`}
                  style={{
                    filter: showPassword ? 'invert(37%) sepia(98%) saturate(1762%) hue-rotate(202deg) brightness(101%) contrast(101%)' : 'none'
                  }}
                  src="frame0.svg"
                  onClick={togglePasswordVisibility}
                  alt={showPassword ? "Hide password" : "Show password"}
                />
              </div>
            </div>
            <div className="w-full flex flex-row sm:flex-row sm:items-center sm:justify-between gap-2 mt-2 mb-4">
              <div className="flex items-center gap-2">
                <div
                  onClick={handleToggle}
                  className={`w-5 h-5 rounded-full border-2 cursor-pointer flex items-center justify-center transition-colors duration-200 ${
                    isChecked
                      ? 'border-ui-colors-blue bg-ui-colors-blue'
                      : 'border-[rgba(0,0,0,0.70)] bg-[#f3f3f3]'
                  }`}
                >
                  {isChecked && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <label
                  htmlFor="terms"
                  onClick={handleToggle}
                  className="text-[rgba(0,0,0,0.70)] text-left font-small cursor-pointer select-none"
                >
                  <span>I agree to the </span>
                  <span className="underline">Terms &amp; Policy</span>
                </label>
              </div>
              <div className="text-ui-colors-blue text-right font-small cursor-pointer select-none">
                Forgot Password?
              </div>
            </div>
            <button
              onClick={()=>onLogin()}
              className="w-full h-12 bg-ui-colors-blue text-white rounded-lg text-lg font-medium shadow-md hover:bg-blue-700 transition-colors"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
