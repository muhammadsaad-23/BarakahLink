# BarakahLink

<div align="center">
  <h3>Community Food Sharing Platform</h3>
  <p>Bridging the gap between local food surplus and those who need it most</p>
</div>

## About

BarakahLink is a community-driven food sharing platform that connects food donors with those in need. Built with React, TypeScript, and Vite, it provides an elegant and accessible way to share surplus food within local communities.

## Features

- 🗺️ **Interactive Map View** - See available food donations on an interactive map
- 📱 **SMS Support** - Access food listings via SMS for users without smartphones
- 🎯 **Smart Filtering** - Filter by city and dietary tags (Halal, Vegan, Vegetarian, etc.)
- 🤖 **AI-Powered Analysis** - Automatic food description analysis and tagging using Google Gemini
- 👥 **Donor Dashboard** - Easy donation posting and management
- 🔒 **Private & Secure** - Community-focused with privacy in mind

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Maps**: Leaflet
- **AI**: Google Gemini API
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Muhammad-Rayyan-Moosani/barakahlink.git
   cd barakahlink
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (optional):
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   > **Note**: The app works without an API key using fallback analysis. Get your API key from [Google AI Studio](https://aistudio.google.com/apikey).

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
barakahlink/
├── components/       # React components
├── backend/          # Backend logic and API
├── frontend/         # Frontend views
├── services/         # External services (Gemini AI)
├── constants.ts      # App constants
├── types.ts          # TypeScript type definitions
└── vite.config.ts    # Vite configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For support, please open an issue on the GitHub repository.

---

Made with ❤️ for the community
