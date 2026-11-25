<div align="center">

# 7ohax Drive

**A scroll-driven 3D portfolio. Scroll to drive a car through a dusk race circuit, past each of my projects.**

[Live site](https://7ohax.github.io/7ohax/) · [Report an issue](https://github.com/7ohax/7ohax/issues)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-000000?logo=threedotjs&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green)

</div>

## About

Hi, I'm **Rohan** (**7ohax**), a first-year BTech student from India. I build web and app projects, compete in hackathons, and like turning rough product ideas into things people can use.

This repository is my portfolio. Instead of a static page, you drive: the page scroll moves a car down a road, and each project appears as a billboard beside it.

## Features

- **Scroll-driven drive:** scroll speed becomes car speed, with a live speedometer, gear indicator and rev-light bar.
- **Procedural 3D car:** a GT-style racer built from code (no model files), with glossy paint, reflections, spoked wheels, a rear wing and a "7OHAX" plate.
- **Effects:** exhaust and tyre smoke, sparks, exhaust pops on braking, speed streaks, a wet-road look, headlight pool, underglow and brake glow.
- **Dusk circuit:** sunset sky with mountains, concrete barriers, street lights and light gantries with sector signs.
- **Colour that follows you:** each project stage has its own accent colour that carries through the car, road and UI.
- **Sound (optional):** a synthesised engine that shifts through gears, wind, pass-by whoosh and exhaust pops. Chosen on the entry screen and toggled with the wave button in the navbar (colourful and moving when on, dim white when off).
- **Content sections:** hero, four project stages, word-by-word message, On track / Off track, Hall of Fame flip cards, tools, links and contact.
- **Responsive and accessible:** works from phone to desktop, respects `prefers-reduced-motion`, and falls back to a plain page if WebGL is unavailable.

## Tech stack

| Area | Tools |
| --- | --- |
| 3D | [Three.js](https://threejs.org/) r128 (loaded from cdnjs), custom GLSL shaders |
| Audio | Web Audio API (all sound is synthesised, no audio files) |
| UI | Vanilla HTML, CSS and JavaScript, no build step |
| Fonts | Unbounded, Inter, JetBrains Mono (Google Fonts) |

## Project structure

```
.
├── index.html            # page markup
├── assets/
│   ├── css/style.css     # all styles
│   └── js/
│       ├── content.js    # your content: profile, projects, milestones
│       └── main.js       # 3D scene, audio, effects, scroll logic
├── LICENSE
└── README.md
```

## Run locally

No install needed.

```bash
git clone https://github.com/7ohax/7ohax.git
cd 7ohax
python3 -m http.server 8000
```

Then open <http://localhost:8000>. (Opening `index.html` directly also works in most browsers.)

## Customise

All text lives in `assets/js/content.js`:

- `PROFILE`: name, role, tagline, email, message, skills and social links
- `PROJECTS`: title, description, tech stack and link for each stage
- `HALL`: hackathons and milestones shown as flip cards

## Deploy

Hosted with GitHub Pages: **Settings → Pages → Deploy from a branch → `main` / root**.
The site is then available at `https://7ohax.github.io/7ohax/`.

## Browser support

Current Chrome, Edge, Firefox and Safari with WebGL. Best experienced on a laptop or recent phone.

## Credits

- Built with [Three.js](https://threejs.org/)
- Fonts by Google Fonts
- Layout idea inspired by scroll-driven brand sites; all artwork, car and code are original

## License

Released under the [MIT License](LICENSE).
