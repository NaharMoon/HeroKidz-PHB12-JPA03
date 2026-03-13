import LoginForm from "@/components/auth/LoginForm";
import { googleAuthEnabled } from "@/lib/authOptions";

const LoginPage = () => {
  return <LoginForm googleEnabled={googleAuthEnabled} />;
};

export default LoginPage;
