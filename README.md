# 🎓 University Lost & Found System

A modern, responsive web application for managing lost and found items on university campuses. Built with Node.js, Express, MongoDB, and EJS templating.

![Lost & Found Hero](https://img.shields.io/badge/Status-Active-brightgreen) ![Node.js](https://img.shields.io/badge/Node.js-v18+-green) ![MongoDB](https://img.shields.io/badge/MongoDB-v6+-green)

## ✨ Features

- **🔍 Browse Items**: View all lost and found items with search functionality
- **📝 Report Lost Items**: Submit detailed reports for lost belongings
- **✨ Report Found Items**: Help others by reporting found items
- **📧 Contact System**: Direct email communication between finders and losers
- **� Dual Theme System**: Toggle between elegant light (beige/sand) and dark (purple-green) themes
- **�🎨 Modern UI**: Beautiful, responsive design with smooth animations and gradient effects
- **📱 Mobile Friendly**: Fully responsive across all devices with optimized mobile experience
- **🔒 Data Persistence**: MongoDB integration for reliable data storage
- **⚡ Real-time Search**: Live filtering without page reloads
- **💾 Theme Persistence**: User theme preferences saved automatically
- **🛠️ Admin Panel**: Command-line tools for data management

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd lost-found
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   ```

4. **Start MongoDB service**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

5. **Run the application**
   ```bash
   npm start
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📦 Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-reload
- `npm run migrate` - Migrate data from JSON to MongoDB
- `npm run view-data` - View all database items
- `npm run view-lost` - View only lost items
- `npm run view-found` - View only found items
- `npm run admin` - Launch interactive admin panel

## 🗂️ Project Structure

```
lost-found/
├── 📁 public/           # Static assets
│   ├── 📁 css/         # Stylesheets
│   └── 📁 js/          # Client-side JavaScript
├── 📁 views/           # EJS templates
│   ├── 📁 partials/    # Reusable template parts
│   ├── index.ejs       # Homepage
│   ├── items.ejs       # Items listing
│   ├── item.ejs        # Item details
│   ├── form_lost.ejs   # Lost item form
│   └── form_found.ejs  # Found item form
├── 📁 routes/          # Express routes
├── 📁 controllers/     # Route handlers
├── 📁 models/          # MongoDB models
├── 📁 data/            # JSON data storage
├── 📁 cli/             # Command-line utilities
├── app.js              # Main application
├── admin.js            # Admin panel
├── migrate.js          # Data migration script
└── view-data.js        # Data viewing utility
```

## 🎨 Design Features

- **🌓 Dual Theme System**: 
  - **Light Theme**: Elegant beige, sand, and French beige color palette
  - **Dark Theme**: Sophisticated purple-green gradient design
  - **Smart Toggle**: Sun/moon emoji button with localStorage persistence
- **Modern CSS Grid & Flexbox**: Responsive layouts with advanced positioning
- **CSS Custom Properties**: Dynamic theming with smooth color transitions
- **Smooth Animations**: Fade-in effects, hover states, and theme switching transitions
- **Professional Typography**: Google Fonts (Inter) with optimized readability
- **Dynamic Gradients**: Beautiful hero sections with theme-aware color schemes
- **Interactive Elements**: Enhanced hover effects, loading states, and visual feedback
- **Accessibility**: Proper focus states, semantic HTML, and high contrast ratios
- **Mobile Optimization**: Touch-friendly interface with responsive breakpoints

## 🌓 Theme System

### Theme Options
- **🌞 Light Theme**: Elegant beige, sand, and French beige palette
  - Warm, welcoming colors perfect for daytime use
  - High contrast text for excellent readability
  - Soft gradients and subtle shadows

- **🌙 Dark Theme**: Sophisticated purple-green gradient design
  - Modern dark interface reduces eye strain
  - Vibrant accent colors with professional appearance
  - Perfect for evening use or low-light environments

### Theme Features
- **Smart Toggle Button**: Sun/moon emoji indicator in navigation
- **Persistent Preferences**: Theme choice saved automatically
- **Smooth Transitions**: Seamless switching between themes
- **System Integration**: Respects user's preferred color scheme
- **Mobile Optimized**: Consistent experience across all devices

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **EJS** - Templating engine
- **dotenv** - Environment variables

### Frontend
- **Vanilla JavaScript** - Interactive features and theme management
- **CSS3** - Modern styling with custom properties and dual-theme system
- **Theme Toggle System** - Dynamic theme switching with localStorage
- **Google Fonts** - Typography optimization
- **Responsive Design** - Mobile-first approach with advanced layouts

## 📊 Database Schema

### Item Model
```javascript
{
  status: String,           // 'lost' or 'found'
  itemName: String,         // Name of the item
  description: String,      // Detailed description
  location: String,         // Where it was lost/found
  date: String,            // Date lost/found
  category: String,        // Item category
  contactName: String,     // Contact person name
  contactEmail: String,    // Contact email (required)
  isDayScholar: Boolean,   // Day scholar status (for lost items)
  keeperInfo: String,      // Who has the item (for found items)
  resolved: Boolean,       // Whether item was returned
  createdAt: Date,         // Auto-generated timestamp
  updatedAt: Date          // Auto-generated timestamp
}
```

## 🔧 Configuration

### Environment Variables (.env)
```bash
# MongoDB Configuration
MONGO_URI=mongodb://127.0.0.1:27017/lost_found
PORT=3000

# For production with MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lost_found
```

## 📝 API Endpoints

- `GET /` - Homepage with latest items
- `GET /items` - Browse all items with search
- `GET /items/:id` - View item details
- `GET /report` - Lost item form
- `POST /report` - Submit lost item
- `GET /found` - Found item form
- `POST /found` - Submit found item

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Database Migration
If you have existing JSON data:
```bash
npm run migrate
```

## 🛡️ Security Features

- Input validation on all forms
- MongoDB injection protection via Mongoose
- Environment variable protection
- Error handling with graceful fallbacks

## 🎯 Future Enhancements

- [ ] Image upload for items with preview functionality
- [ ] User authentication system with profiles
- [ ] Email notifications for matched items
- [ ] Advanced search filters and sorting options
- [ ] Mobile app version with push notifications
- [ ] Admin web dashboard with analytics
- [ ] Item expiration system with automatic cleanup
- [ ] Statistics dashboard with visual charts
- [ ] Multi-language support
- [ ] Additional theme options and customization
- [ ] Item matching algorithm based on descriptions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Manyas15**
- GitHub: [@manyas15](https://github.com/manyas15)
- Repository: [Lost-and-found](https://github.com/manyas15/Lost-and-found)

## 🙏 Acknowledgments

- University for the project requirements and academic support
- MongoDB community for excellent documentation and tutorials
- Express.js team for the robust and flexible framework
- Open source community for inspiration and best practices
- CSS and JavaScript communities for modern web development techniques

---

### 📞 Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/manyas15/Lost-and-found/issues) page
2. Create a new issue with detailed information about the problem
3. Contact the development team through GitHub discussions
4. Review the documentation and troubleshooting guides

**Made with ❤️ for university students by Manyas15**
