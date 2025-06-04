import { useEffect, useState } from "react";
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

  useEffect(() => {
    console.log(window.innerWidth, window.innerHeight);
  }, []);

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
      <div className="max-w-[1240px] w-[calc(64vw)] min-h-[740px] h-[calc(70vh)] bg-[#F3F3F3] rounded-3xl shadow-[24px_48px_96px_0_rgba(0,0,0,0.22)] flex flex-row md:flex-row gap-6 overflow-hidden px-6 py-6">
        <div className="bg-white w-full p-8 rounded-3xl flex items-center justify-center">
          <img
            className="w-[36rem] h-[36rem] object-contain mx-auto"
            src="logo-adverse-03-10.png"
            alt="Logo"
          />
        </div>
        <div className="bg-white w-full p-8 rounded-3xl flex flex-col justify-center items-center ">
          <div className="w-4/5 mb-16">
            <img
              className="w-[208px] h-[70px] object-contain mb-6"
              src="logo-adverse-02-10.png"
              alt="Adverse Logo"
            />
            <div className="text-black text-left text-[34px] md:text-3xl mb-2 font-sfpro font-medium">Get Started Now</div>
            <div className="text-black/60 text-left text-[15px] font-sfpro mb-6 font-medium">
              Sign in to view real-time insights, player analytics, and AI reports.
            </div>
            <div className="flex flex-col gap-4 w-full mx-auto">
              <div>
                <label className="block text-black font-semibold mb-1 text-[16px]" htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="workmail@gmail.com"
                  className="w-full p-4 rounded-lg border border-ui-colors-blue font-sfpro font-medium text-[16px]  focus:outline-none focus:border-blue-600 focus:border-2 focus:ring-0 text-black"
                />
              </div>
              <div className="relative">
                <label className="block text-black font-semibold mb-1 text-[16px]" htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    className="w-full p-4 rounded-lg border border-ui-colors-blue font-sfpro font-medium focus:outline-none focus:border-blue-600 focus:border-2 focus:ring-0 shadow-sm text-[16px]  text-black"
                  />
                  <img
                    className={`w-6 h-6 absolute right-5  top-1/2 -translate-y-1/2 cursor-pointer transition-colors duration-200 ${showPassword ? 'filter' : ''}`}
                    style={{
                      filter: showPassword ? 'invert(37%) sepia(98%) saturate(1762%) hue-rotate(202deg) brightness(101%) contrast(101%)' : 'none'
                    }}
                    src="frame.svg"
                    onClick={togglePasswordVisibility}
                    alt={showPassword ? "Hide password" : "Show password"}
                  />
                </div>
              </div>
              <div className=" flex flex-row justify-between gap-2 mt-2 mb-4">
                <div className="flex items-center gap-2">
                  <div
                    onClick={handleToggle}
                    className={`w-5 h-5 rounded-full border-2 cursor-pointer flex items-center justify-center transition-colors duration-200 ${isChecked
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
                    className="text-[rgba(0,0,0,0.70)] text-left cursor-pointer select-none font-sfpro font-medium text-[16px]"
                  >
                    <span>I agree to the </span>
                    <span className="underline">Terms &amp; Policy</span>
                  </label>
                </div>
                <div className="text-ui-colors-blue text-right  cursor-pointer select-none font-sfpro font-medium text-[16px]">
                  Forgot Password?
                </div>
              </div>
              <button
                onClick={() => onLogin()}
                className="w-full p-4 bg-ui-colors-blue text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-colors font-sfpro font-medium text-[20px]"
              >
                Log In
              </button>
            </div>
           
        </div>
      </div>
    </div>
    </div >
  );
};
