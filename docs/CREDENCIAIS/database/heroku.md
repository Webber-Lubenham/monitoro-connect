
# Configurações de Banco de Dados Heroku

## 🐘 Heroku PostgreSQL
- **Connection Details**
  - Host: `ec2-44-208-63-177.compute-1.amazonaws.com`
  - Database: `d74lr36n3k82ot`
  - User: `uc34cq0ev0g28d`
  - Port: `5432`
  - SSL Mode: `require`
  - Connection URI: `postgres://uc34cq0ev0g28d:pf11dbf327b9a513b0c1e3beeffc473c6697a9c6459b8c928e3ba689812c9d2ac@ec2-44-208-63-177.compute-1.amazonaws.com:5432/d74lr36n3k82ot`

## 🚀 Heroku Deployment

### Application Details
- 📱 **App Name:** `sistema-monitore`
- 🌐 **Web URL:** `https://sistema-monitore-a6a2cbdcb346.herokuapp.com`
- 🏗️ **Stack:** heroku-24
- 📦 **Framework:** Node.js
- 🔗 **Git URL:** `https://git.heroku.com/sistema-monitore.git`

### Database (PostgreSQL)
- 📊 **Plan:** Standard 0
- 💾 **Usage:** 17.2 MB / 64 GB
- 🔌 **Connections:** 12/120
- 🔄 **Version:** 16.6

### CLI Access
```bash
# Connect to Database
heroku pg:psql postgresql-flexible-00117 --app sistema-monitore

# View Logs
heroku logs --tail --app sistema-monitore

# Scale Dynos
heroku ps:scale web=1 --app sistema-monitore
```
