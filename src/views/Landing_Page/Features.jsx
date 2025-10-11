import AnimateOnView from '../components/AnimateOnView.jsx';

export default () => {
    const features = [
        {
            icon: "fa-solid fa-pen-to-square",
            title: "Effortless Note Editing",
            description: "Enjoy a clean and intuitive editor. Your changes are saved automatically in the background, so you can focus on writing without worrying about losing your work."
        },
        {
            icon: "fa-solid fa-tags",
            title: "Powerful Tagging System",
            description: "Organize your notes with custom tags. Create new tags on the fly, assign multiple tags to a note, and easily find all notes associated with a specific tag."
        },
        {
            icon: "fa-solid fa-box-archive",
            title: "Smart Organization",
            description: "Keep your workspace tidy. Mark notes as 'Favorite' for quick access, 'Archive' them to hide from the main view, or move them to the 'Trash' for later deletion."
        },
        {
            icon: "fa-solid fa-grip",
            title: "Flexible Views",
            description: "Choose how you want to see your notes. Switch between a visual 'Grid View' for a card-based layout or a compact 'List View' for a more dense display."
        },
        {
            icon: "fa-solid fa-magnifying-glass",
            title: "Advanced Sorting & Search",
            description: "Find what you need, fast. Sort your notes by title or date, and use the powerful search bar to instantly filter notes based on their title or content."
        },
        {
            icon: "fa-solid fa-moon",
            title: "Comfortable Dark Mode",
            description: "Reduce eye strain with a beautiful dark theme. Perfect for late-night writing sessions or low-light environments, fully integrated across the app."
        },
        {
            icon: "fa-solid fa-shield-halved",
            title: "Secure Authentication",
            description: "Your notes are private and secure. We use a robust JWT (JSON Web Token) authentication system with refresh tokens to ensure your session is always protected."
        },
        {
            icon: "fa-solid fa-mobile-screen-button",
            title: "Fully Responsive",
            description: "Access your notes anytime, anywhere. The interface is designed to work flawlessly on any device, whether you're on a desktop, tablet, or mobile phone."
        }
    ];

    return (
        <div className="container mx-auto px-6 py-8 md:py-12 font-mono">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600">Dotify Features</h1>
                <p className="mt-4 text-base md:text-lg text-gray-600">Everything you need to keep your ideas organized.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
                {features.map((feature, index) => (
                    <AnimateOnView key={index} delay={index * 0.1}>
                        <div className="bg-white p-6 h-full rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <i className={`${feature.icon} text-3xl text-blue-500 mb-4`}></i>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-700 leading-relaxed">{feature.description}</p>
                        </div>
                    </AnimateOnView>
                ))}
            </div>
        </div>
    );
}