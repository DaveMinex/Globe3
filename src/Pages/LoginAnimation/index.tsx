import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const messages = [
  { text: "Hello! Welcome", color: "text-blue-600", className: "text-[#0071E3] font-Nenu text-2xl font-medium" },
  { text: "Click on the button to do your KYC", color: "text-gray-400", className: "font-Nenu text-2xl" },
  { text: "Please Wait...", color: "text-gray-400", className: "font-Nenu text-2xl"},
  { text: "Your KYC validated successfully, click the button to login.", color: "text-gray-400", className: "font-Nenu text-2xl" },
];

export interface ICoverPageProps {
  className?: string;
}

export const LoginAnimation = ({ className, ...props }: ICoverPageProps): JSX.Element => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  // Demo: Automatically cycle through messages
  useEffect(() => {
    if (step <= messages.length - 1 && (step === 0 || step === 2)) {
      const timer = setTimeout(() => setStep(step + 1), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleButtonClick = () => {
    if (step === messages.length - 1) {
      navigate("/login");
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div className={` min-h-screen w-full flex items-center justify-center bg-white  px-2   ${className}`}>
      <div className="w-[1400px] h-[100vh] bg-[#FCFCF5] flex items-end justify-center md:flex-row gap-6 overflow-hidden px-6 py-6 main-back">
        <div className="flex flex-col items-center justify-center mb-5">

          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div
                key={step}
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className={`mb-8 text-center ${messages[step].color} ${messages[step].className}`}
                style={{ overflow: "hidden", display: "inline-block" }}
              >
                {messages[step].text}
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`mb-8 text-center ${messages[step].color} ${messages[step].className}`}
              >
                {messages[step].text}
              </motion.div>
            )}
          </AnimatePresence>
          {step === 0 ? (
            <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              exit={{ clipPath: "inset(0 100% 0 0)" }}
              transition={{
                duration: 1,
                ease: "easeInOut",
                delay: 0.5,
              }}
              style={{ overflow: "hidden", display: "inline-block" }}
            >
              <button
                className="w-[57px] h-[57px] rounded-full border-2 border-gray-200 shadow-[5px_9px_15px_0_rgba(0,0,0,0.4)]"
                onClick={handleButtonClick}
              >
                <img
                  src="frame-50.png"
                  alt="Button"
                  className="w-full h-full object-cover rounded-full"
                /> 
              </button>
            </motion.div>
          ) : (
            <button
              className="w-[57px] h-[57px] rounded-full border-2 border-gray-200 shadow-[5px_9px_15px_0_rgba(0,0,0,0.4)]"
              onClick={handleButtonClick}
            >
              <img
                src="frame-50.png"
                alt="Button"
                className="w-full h-full object-cover rounded-full"
              /> 
            </button>
          )}

        </div>
      </div>
    </div>
  );
};
