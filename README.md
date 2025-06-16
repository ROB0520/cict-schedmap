# CICT Schedule Map

A modern web application built with Next.js that helps visualize and manage class schedules for the College of Information and Communications Technology.

## 🎓 Overview

CICT Schedule Map is a web-based platform designed to provide an intuitive and visual representation of class schedules. Built with modern web technologies, it offers a seamless experience for viewing and managing academic schedules.

## ✨ Features

### Core Functionality
- **Interactive Schedule View**: Visual representation of class schedules with an intuitive interface
- **Dynamic Updates**: Real-time schedule updates and modifications
- **Schedule Management**: Easy-to-use tools for managing class schedules
- **Data Persistence**: Reliable storage and retrieval of schedule information

### User Experience
- **Dark/Light Theme Toggle**: Seamless theme switching with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Fast Performance**: Built with Next.js for optimal loading speeds
- **Accessible Interface**: WCAG compliant design with keyboard navigation
- **Modern UI**: Clean and intuitive user interface

### Technical Features
- **Modern Stack**: Built with Next.js 15 and React 19
- **Type Safety**: Full TypeScript implementation
- **Modular Components**: Built with shadcn/ui and Radix UI
- **Mobile-First**: Responsive design that works across all devices
- **Performance Optimized**: Fast loading and smooth interactions

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS with tailwind-merge
- **Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Language**: TypeScript
- **Theme System**: next-themes
- **Development**: Turbopack for fast builds

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or later
- npm (or your preferred package manager)

## 📁 Project Structure

```
├── app/
│   ├── data.json              # Schedule and configuration data
│   ├── layout.tsx             # Root layout with theme provider
│   ├── page.tsx              # Homepage with schedule view
│   ├── schedule.tsx          # Schedule component
│   └── globals.css           # Global styles
├── components/
│   ├── mode-toggle.tsx       # Theme toggle component
│   ├── theme-provider.tsx    # Theme context provider
│   └── ui/                   # UI components
│       ├── button.tsx        # Button component
│       ├── dropdown-menu.tsx # Dropdown menu component
│       ├── select.tsx        # Select component
│       └── separator.tsx     # Separator component
├── lib/
│   └── utils.ts              # Utility functions
└── public/
    └── logo.svg              # Application logo
```

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rob0520/cict-schedmap.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Theming & Customization

The application features a theming system:

### Theme Toggle
- **System Detection**: Automatically respects user's system preference (dark/light)
- **Manual Override**: Toggle between dark and light modes

### Course Data Management
- **JSON Configuration**: Course and program data stored in `app/data.json`
- **Type Safety**: Strongly typed course and program interfaces
- **Easy Updates**: Simple JSON structure for adding new programs or courses
- **Flexible Structure**: Supports multiple majors, semesters, and year levels

## 🔧 Configuration

### Adding New Programs/Courses
Update the `app/data.json` file with new program data:

```json
{
  "programs": {
    "PROGRAM_CODE": {
      "code": "PROGRAM_CODE",
      "name": "Program Name",
      "majors": [
        {
          "code": "MAJOR_CODE",
          "name": "Major Name"
        }
      ]
    }
  },
  "courses": {
    "PROGRAM_CODE": [
      {
        "code": "COURSE_CODE",
        "name": "Course Name",
        "units": 3,
        "year": 1,
        "semester": 1,
        "major": "MAJOR_CODE"
      }
    ]
  }
}
```

### SEO Configuration
Update meta tags in `app/layout.tsx`:
- **Title and Description**: Update site metadata
- **Open Graph Images**: Replace with your branded assets
- **Domain Configuration**: Update metadataBase URL or `NEXT_PUBLIC_SITE_URL` environment variable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📈 Future Enhancements

- **Room Management**: Interactive room allocation and conflict detection
- **Schedule Export**: PDF and calendar export functionality
- **Conflict Resolution**: Automatic detection and resolution of schedule conflicts
- **Mobile App**: Native mobile application for on-the-go schedule access
- **Schedule Templates**: Reusable schedule templates for different semesters
- **Analytics Dashboard**: Insights on room utilization and schedule efficiency

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 📧 Contact

For questions, suggestions, or course additions, please email: [cict+schedmap@aleczr.link](mailto:cict+schedmap@aleczr.link)

---

**Live Site**: [schedmap.vps.aleczr.link](https://schedmap.vps.aleczr.link)

Made with ❤️ for the NEUST community