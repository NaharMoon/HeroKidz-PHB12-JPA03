import { RegisterForm } from "@/components/auth/RegisterForm";
import { googleAuthEnabled } from "@/lib/authOptions";

const RegisterPage = () => {
  return <RegisterForm googleEnabled={googleAuthEnabled} />;
};

export default RegisterPage;
