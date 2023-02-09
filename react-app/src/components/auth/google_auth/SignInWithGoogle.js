import env from 'react-dotenv';
export default function SignInWithGoogle() {

    return <div>
        <div id="g_id_onload"
            data-client_id={env.GOOGLE_OAUTH_CLIENT_ID}
            data-context="signin"
            data-ux_mode="popup"
            data-auto_prompt="false">
        </div>
    </div>

}
