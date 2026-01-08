const githubLink = "https://github.com/Sol-Gui";

const projectsData = {
    1: {
        name: "JacacultMap",
        tags: ["TypeScript", "React Native", "Node.js", "MongoDB", "Express"],
        image: "https://placehold.co/600x300/1e293b/a78bfa?text=Project+1",
        purpose: "The purpose of JacacultMap is to help users discover and track the locations of cultural events in an easy and accessible way.",
        features: ["Event discovery by location", "Mobile and web support", "Event tracking", "Front-end is blocked when the back-end is down for security and usability."],
        github: `${githubLink}/JacacultMap`,
        demo: "https://JacacultMap-app.vercel.app/"
    },
    2: {
        name: "ZMiniChain",
        tags: ["Java", "WebSocket", "PostgreSQL", "React", "TypeScript"],
        image: "https://placehold.co/600x300/1e293b/a78bfa?text=Project+2",
        purpose: "The purpose of ZMiniChain is to provide a local blockchain simulation similar to Ganache, designed for learning and testing purposes.",
        features: ["Local development blockchain environment", "Instant block mining simulation", "Transaction and block handling", "Pure Java API developed from scratch"],
        github: `${githubLink}/ZMiniChain-APP`,
        demo: "https://ZMiniChain-app.vercel.app/"
    }
};

export function initProjectsModal() {
    window.openModal = function (projectId) {
        const modal = document.getElementById('project-modal');
        const project = projectsData[projectId];

        if (!project) return;

        const imageContainer = document.getElementById('modal-image');
        if (project.image) {
            imageContainer.innerHTML = `<img src="${project.image}" alt="${project.name}">`;
        } else {
            imageContainer.innerHTML = '';
        }

        document.getElementById('modal-title').textContent = project.name;
        document.getElementById('modal-purpose').textContent = project.purpose;

        const tagsContainer = document.getElementById('modal-tags');
        tagsContainer.innerHTML = project.tags.map(tag =>
            `<span class="project-tag">${tag}</span>`
        ).join('');

        const featuresContainer = document.getElementById('modal-features');
        featuresContainer.innerHTML = project.features.map(feature =>
            `<li>${feature}</li>`
        ).join('');

        document.getElementById('modal-github').href = project.github;
        const demoLink = document.getElementById('modal-demo');
        if (project.demo) {
            demoLink.href = project.demo;
            demoLink.style.display = 'inline-block';
        } else {
            demoLink.style.display = 'none';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function (event) {
        if (event && event.target !== event.currentTarget) return;
        const modal = document.getElementById('project-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.closeModal();
        }
    });
}
