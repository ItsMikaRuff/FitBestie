

const SignUpSuccessful = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Sign Up Successful!</h1>
            <p className="text-lg mb-8">Welcome to our platform! You can now log in.</p>
            <a href="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Go to Login
            </a>
        </div>
    );
}

export default SignUpSuccessful;