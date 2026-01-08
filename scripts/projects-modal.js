const projectsData = {
    1: {
        name: "project-name-one",
        tags: ["React", "Node.js", "MongoDB"],
        image: "https://placehold.co/600x300/1e293b/a78bfa?text=Project+1",
        purpose: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        features: ["Feature placeholder 1", "Feature placeholder 2", "Feature placeholder 3", "Feature placeholder 4"],
        github: "https://github.com/",
        demo: "https://example.com"
    },
    2: {
        name: "project-name-two",
        tags: ["Python", "Django", "PostgreSQL"],
        image: "https://placehold.co/600x300/1e293b/a78bfa?text=Project+2",
        purpose: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        features: ["Feature placeholder 1", "Feature placeholder 2", "Feature placeholder 3"],
        github: "https://github.com/",
        demo: "https://example.com"
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
