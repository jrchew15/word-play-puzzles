
export default function SignInWithGoogle() {

    return <div>
        <div id="g_id_onload"
            data-client_id={process.env.GOOGLE_OAUTH_CLIENT_ID}
            data-context="signin"
            data-ux_mode="popup"
            data-auto_prompt="false">
            {process.env.GOOGLE_OAUTH_CLIENT_ID}?
        </div>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
    </div>

}
