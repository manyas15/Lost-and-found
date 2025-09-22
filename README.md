# 🎓 University Lost & Found System

A modern, responsive web application for managing lost and found items on university campuses. Built with Node.js, Express, MongoDB, and EJS templating.

![Lost & Found Hero](https://img.shields.io/badge/Status-Active-brightgreen) ![Node.js](https://img.shields.io/badge/Node.js-v18+-green) ![MongoDB](https://img.shields.io/badge/MongoDB-v6+-green)

## ✨ Features

- **🔍 Browse Items**: View all lost and found items with search functionality
- **📝 Report Lost Items**: Submit detailed reports for lost belongings
- **✨ Report Found Items**: Help others by reporting found items
- **📧 Contact System**: Direct email communication between finders and losers
- **🎨 Modern UI**: Beautiful, responsive design with smooth animations
- **📱 Mobile Friendly**: Fully responsive across all devices
- **🔒 Data Persistence**: MongoDB integration for reliable data storage
- **⚡ Real-time Search**: Live filtering without page reloads
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

- **Modern CSS Grid & Flexbox**: Responsive layouts
- **CSS Custom Properties**: Consistent theming
- **Smooth Animations**: Fade-in effects and hover states
- **Google Fonts**: Professional typography with Inter font
- **Gradient Backgrounds**: Beautiful hero sections
- **Interactive Elements**: Hover effects and loading states
- **Accessibility**: Proper focus states and semantic HTML

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **EJS** - Templating engine
- **dotenv** - Environment variables

### Frontend
- **Vanilla JavaScript** - Interactive features
- **CSS3** - Modern styling with custom properties
- **Google Fonts** - Typography
- **Responsive Design** - Mobile-first approach

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

- [ ] Image upload for items
- [ ] User authentication system
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Mobile app version
- [ ] Admin web dashboard
- [ ] Item expiration system
- [ ] Statistics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- University for the project requirements
- MongoDB community for excellent documentation
- Express.js team for the robust framework
- Open source community for inspiration

---

### 📞 Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/yourusername/lost-found/issues) page
2. Create a new issue with detailed information
3. Contact the development team

**Made with ❤️ for university students**
