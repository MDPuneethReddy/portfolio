import { FaReact } from "react-icons/fa";
import { FaNode } from "react-icons/fa";
import { FaJava } from "react-icons/fa";
import { FaPython } from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io";
import { RiNextjsFill } from "react-icons/ri";
import { SiFlask } from "react-icons/si";
import { SiFastapi } from "react-icons/si";
import { FaDocker } from "react-icons/fa";
import { SiCypress } from "react-icons/si";
import { SiMysql } from "react-icons/si";
import { DiMongodb } from "react-icons/di";
import { BiLogoPostgresql } from "react-icons/bi";
import { SiRabbitmq } from "react-icons/si";
import { FaGit } from "react-icons/fa";
import { SiExpress } from "react-icons/si";
import { GrGraphQl } from "react-icons/gr";
import { FaFigma } from "react-icons/fa";
import { FaHtml5 } from "react-icons/fa";
import { IoLogoCss3 } from "react-icons/io5";
import { SiTypescript } from "react-icons/si";
import { SiSpring } from "react-icons/si";
import { SiJest } from "react-icons/si";
import { SiHibernate } from "react-icons/si";
import { FaJenkins } from "react-icons/fa";



export const pages = [ 'home','About','experience','projects',
  // 'certification'
  // , 
  'contact'];

const size=30
export const skills = [
  { name: 'JavaScript', rating: 8,icon:<IoLogoJavascript size={size} />  },
  {name:'Python',rating: 8,icon:<FaPython size={size} />  },
  {name:"TypeScript",rating:8,icon:<SiTypescript size={size}/>  },
  {name: 'Java', rating: 7,icon:<FaJava size={size}/>},
  {name: 'Reactjs', rating:8,icon:<FaReact size={size} />},
  {name: 'Nextjs', rating:6,icon:<RiNextjsFill size={size}/>  },
  {name: 'Nodejs',rating: 8,icon:<FaNode size={size} />},
  {name: "Flask",rating:5,icon:<SiFlask size={size}/>  },
  {name: 'FastAPI',rating:6,icon:<SiFastapi size={size}/>  },
  {name:'Docker', rating:5,icon:<FaDocker size={size}/>  },
  {name:'Cypress', rating:7,icon:<SiCypress size={size}/>  },
  {name:'MySQL', rating:8,icon:<SiMysql size={size}/>  },
  {name:"Mongodb",rating:7,icon:<DiMongodb size={size}/>  },
  {name:"PostgreSQL",rating: 8,icon:<BiLogoPostgresql size={size}/>  },
  {name:"RabbitMQ",rating:8,icon:<SiRabbitmq size={size}/>  },
  {name:"Git",rating:8,icon:<FaGit size={size}/>  },
  {name:"ExpressJS",rating:8,icon:<SiExpress size={size}/>  },
  {name:"GraphQL",rating:8,icon:<GrGraphQl size={size}/>  },
  {name:"Figma",rating:8,icon:<FaFigma size={size}/>  },
  {name:"HTML",rating:8,icon:<FaHtml5 size={size}/>},
  {name:"CSS",rating:8,icon:<IoLogoCss3 size={size}/>  },
  {name:"SpringBoot",rating:5,icon:<SiSpring  size={size}/>  },
  {name:"Jest",rating:8,icon:<SiJest size={size}/>  },
  {name:"Hibernate",rating:8,icon:<SiHibernate size={size}/>},
  {name:"Jenkins",rating:8,icon:<FaJenkins size={size} />}
  
];
export const experiences = [
  {
    title: 'Software Developer Intern',
    company: 'Florida state University',
    date: 'May 2024 - present',
    description: [
      "I develop user-friendly web applications with ReactJS and FastAPI, contributing to a seamless and intuitive user experience. Additionally, I've effectively Dockerized web components, enhancing their scalability and streamlining deployment processes. These applications have been successfully deployed on Nvidia GPUs, further optimizing performance. For logging, we utilize Prometheus and Grafana, enabling comprehensive monitoring and analysis of system performance. I also contribute to the design and development processes using Figma, ensuring visually cohesive and user-centric interfaces."
    ]
  },
    {
      title: 'Graduate Research Assistant- Automated Software Developer',
      company: 'Florida state University',
      date: 'Aug 2023 - May 2024',
      description: [
        "I develop user-friendly web applications with ReactJS and FastAPI, contributing to a seamless and intuitive user experience. Additionally, I've effectively Dockerized web components, enhancing their scalability and streamlining deployment processes. These applications have been successfully deployed on Nvidia GPUs, further optimizing performance. For logging, we utilize Prometheus and Grafana, enabling comprehensive monitoring and analysis of system performance. I also contribute to the design and development processes using Figma, ensuring visually cohesive and user-centric interfaces."
      ]
    },
    {
      title: 'Full Stack Developer',
      company: 'Novartis',
      date: 'Aug 2021 - Dec 2022',
      description: [
        ' Led the implementation of a robust user access control system, ensuring heightened data security. Developed a collaborative Excel data tracking system for efficient change monitoring. Proficiently managed complex SQL queries on patient databases using RabbitMQ for data analysis. Created a modern GraphQL API in Node.js, enhancing data retrieval and client-server communication. Crafted a user-friendly tool for secure data retrieval, resembling a terminal interface, using React and WebSockets. Authored a comprehensive suite of tests, utilized Docker for consistent deployment, and managed deployments on RedHat OpenShift. Rewrote open-source Python packages to JavaScript, designed microservices for parallel data processing, and created detailed project documentation using Docusaurus. Demonstrated expertise in various databases, developed an email module using Nodemailer, and employed TYPEORM for seamless backend-database interaction. Leveraged Redis for efficient data caching, contributing to improved system performance.',
      ],
    },
    {
      title: 'Data Engineer - Internship',
      company: 'Novartis',
      date: 'Aug 2020 - July 2021',
      description: [
        "In my roles, I've designed and implemented robust user access control systems, developed data tracking systems, and executed complex SQL queries on extensive patient databases. I've crafted modern GraphQL APIs, created user-friendly tools for secure data retrieval, and authored a comprehensive suite of tests for software reliability. My proficiency extends to Docker deployment, microservices design, and diverse databases like PostgreSQL, MongoDB, MySQL, and SQLite. I've demonstrated expertise in email module development, utilized Redis for caching, and efficiently managed multiple database connections using TYPEORM. Throughout, I've prioritized clear documentation, enhancing communication, scalability, and system performance."
      ],
    },
    {
      title: 'Software Developer - Internship',
      company: 'Grepthor Software Solutions',
      date: 'Jun 2019 - Aug 2019',
      description: [
        "I created a Book Store Management System using Python and MySQL. I used the Flask web framework for building the application, which helped in efficient routing and handling of HTTP requests. The system is now accessible and scalable as it's deployed on the Heroku platform."
      ]
    }
  ];

export const projects = [
  {
    title: 'ReviewZ',
    image: './assets/Reviewz.png',
    githubLink: 'https://github.com/yashasgowda11/Reviewz',
    description: "Movie Review application",
    techStack:["ReactNative","Figma","UI/UX","D3"]
  },
  {
    title: 'Covid19 impact on US stocks',
    image: './assets/stocks.png',
    githubLink: 'https://github.com/MDPuneethReddy/covid_impact_on_USA_stocks',
    description: "Covid impact on USA stock market",
    techStack: ["pandas","numpy","scikit-learn"]
  },
  {
    title: 'Diexperts1',
    image: './assets/diexperts1.png',
    githubLink: 'https://diexperts1.com/',
    description: "Created an website for Diexperts1 company",
    techStack:["Reactjs","Figma","UI/UX","tailwindCSS","NextUI","FormSpree"]
  },
    {
      title: 'Expense Analyser',
      image: './assets/Expense Anlayser.png',
      githubLink: 'https://github.com/MDPuneethReddy/ExpenseCalculator',
      description: "Analyze expenses application",
      techStack:["Nodejs","Reactjs","Firebase","Redux","Expressjs","D3"]
    },
    // {
    //   title: 'Fetch Index Pages',
    //   image: './assets/fetch.png',
    //   githubLink: 'https://github.com/MDPuneethReddy/GetIndexPages',
    //   description: "Fetching index pages for URL",
    //   techStack:["puppeteer","Reactjs","WebSockets","Nodejs","AntD"]
    // },
    // {
    //     title: 'Diabetes Prediction',
    //     image: './assets/diabetes.png',
    //     githubLink: 'https://github.com/MDPuneethReddy/diabetesprediction-flask',
    //     description: "Predicting diabetes Application",
    //     techStack: ["Flask","python","numpy","pandas","scikit-learn"]
    //   },
    //   {
    //     title: 'Tech blog',
    //     image: './assets/puneethreddy.png',
    //     githubLink: 'https://github.com/MDPuneethReddy/personalblog',
    //     description: "Personal Tech Blog",
    //     techStack:["Nextjs","Firebase","AntD"]
    //   },
    //   {
    //     title: 'Authentication System',
    //     image: './assets/authentication.png',
    //     githubLink: 'https://github.com/MDPuneethReddy/twoWayAuthentication_nodemailer_reactjs',
    //     description: "Simple Authentication System",
    //     techStack:["Reactjs","Firebase","nodemailer"]
    //   },
      {
        title: 'Covid Tracker',
        image: './assets/covid.png',
        githubLink: 'https://github.com/MDPuneethReddy/Covidtracker_reactjs',
        description: "Tracking Covid Cases",
        techStack:["Reactjs","D3"]
      },
      {
        title: 'Multithread calculator',
        image: './assets/calculator.png',
        githubLink: 'https://github.com/MDPuneethReddy/cpdp_multithread_calculator',
        description: "Calculator with heavy calculations",
        techStack:["Reactjs","MaterialUI","RabbitMQ"]
      }
  ];

  export const frontendskills=[
    { name: 'React', proficiency: 'Experienced' },
    { name: 'JavaScript', proficiency: 'Experienced' },
    { name: 'HTML',proficiency:"Experienced"},
    {name:'CSS',proficiency:"Basic"},
    {name:'Agile', proficiency: "Experienced"},
    {name:'scrum',proficiency:"Experienced"},
    {name:'GIT', proficiency:"Experienced"},
    {name: 'Figma',proficiency: "Intermediate"},
    {name: 'Github',proficiency: "Experienced"}
  ];
  export const backendskills=[
    { name: 'Node.js', proficiency: 'Experienced' },
    { name: 'Express', proficiency: 'Intermediate' },
    {name:'MySQL', proficiency: 'Experienced' },
    {name:'SQLite', proficiency: 'Experienced' },
    {name:'PostgreSQL', proficiency: 'Experienced' },
    {name:'Docker', proficiency: 'Experienced' },
    {name:'RabbitMQ', proficiency: 'Experienced' },
    {name:'websockets', proficiency: 'Experienced' },
    {name:'GraphQL',proficiency: 'Intermediate'},
  ]

  export const certifications = [
    {
      title: "AWS Certified Cloud Practitioner",
      image:"./assets/AWS cloud practitioner.png",
      link:"https://cp.certmetrics.com/amazon/en/public/verify/credential/00c325265ff84d4398ec6e838aeb38c9"

    },
    {
      title: 'Infosys Certified Software Programmer',
      image: './assets/infosys.png',
      link: 'https://drive.google.com/file/d/1YuG11JnbD078j6kIM4vgjaRTTNCEdqg0/view?usp=sharing',
    },
    {
      title: 'Design Patterns',
      image: './assets/design.png',
      link: 'https://www.coursera.org/account/accomplishments/verify/8LZAFWJBDWYE',
    },
    {
        title: 'Software Processes and Agile Practices',
        image: './assets/agile.png',
        link: 'https://www.coursera.org/account/accomplishments/verify/7WMWJAGPE5CQ',
      },
      {
        title: 'Java Programming: Solving Problems with Software',
        image: './assets/java.png',
        link: 'https://www.coursera.org/account/accomplishments/verify/8PSMV5FWZ5RQ',
      }
    ]