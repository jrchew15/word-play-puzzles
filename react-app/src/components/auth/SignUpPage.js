import SignUpForm from "./SignUpForm";
import SignInWithGoogle from "./google_auth/SignInWithGoogle";

export default function SignUpPage() {

    return (
        <div id='signup-page'>
            <h2>Sign Up</h2>
            <SignUpForm />
            <SignInWithGoogle />
        </div>
    )
}
