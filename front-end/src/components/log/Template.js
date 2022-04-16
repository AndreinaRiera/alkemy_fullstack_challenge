export default function Template({ children, title, handleSubmit, onSubmit }) {
    return (
        <div className="d-flex min-h-100vh">
            <div className="bg-primary text-light col-7 d-none d-md-flex align-items-center p-md-5 ">
                <div className="container">
                    <h2>Personal budget!</h2>
                    <p>Project created for the Alkemy Fullstack JS Challenge.You can see the complete project and all its characteristics from <a href="https://github.com/AndreinaRiera/alkemi_fullstack_challenge_proyect" target="_blank" rel="noopener noreferrer">Github</a></p>
                </div>
            </div>

            <form className="col d-flex  align-items-center p-md-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="container">
                    <h1 className="text-center">{title}</h1>

                    {children}
                </div>
            </form>
        </div >
    )
}
