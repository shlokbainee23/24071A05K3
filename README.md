# 24071A05K3 — ClickKart Internal Lab Experiments

**Roll No:** 24071A05K3  
**Project:** ClickKart Shopping Portal

This repository contains two experiments:

- `exp1/ClickKart`: React (Vite) frontend
- `exp2`: Java Servlet backend for Tomcat 10+

## Run exp1 (React)

```bat
cd exp1\ClickKart
npm install
npm run dev
```

Runs at `http://localhost:3000`.

## Run exp2 (Tomcat servlet)

```powershell
cd exp2
.\setup.ps1
```

Then open `http://localhost:8080/exp2/discount`.

Stop Tomcat with:

```powershell
cd exp2
.\stop.ps1
```

