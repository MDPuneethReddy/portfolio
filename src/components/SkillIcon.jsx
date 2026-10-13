import React from 'react'
import { FaReact, FaNodeJs, FaJava, FaPython, FaDocker, FaGitAlt, FaFigma, FaJenkins } from 'react-icons/fa'
import { SiJavascript, SiTypescript, SiNextdotjs, SiFastapi, SiGraphql, SiPostgresql, SiMongodb, SiRabbitmq, SiRedis, SiSpring, SiCypress, SiJest } from 'react-icons/si'

const map = {
  js: [SiJavascript, '#F7DF1E'],
  ts: [SiTypescript, '#3178C6'],
  react: [FaReact, '#61DAFB'],
  node: [FaNodeJs, '#5FA04E'],
  python: [FaPython, '#FFD43B'],
  next: [SiNextdotjs, '#ffffff'],
  fastapi: [SiFastapi, '#05998B'],
  graphql: [SiGraphql, '#E10098'],
  postgres: [SiPostgresql, '#4169E1'],
  mongo: [SiMongodb, '#47A248'],
  docker: [FaDocker, '#2496ED'],
  rabbit: [SiRabbitmq, '#FF6600'],
  redis: [SiRedis, '#FF4438'],
  java: [FaJava, '#EA2D2E'],
  spring: [SiSpring, '#6DB33F'],
  cypress: [SiCypress, '#69D3A7'],
  jest: [SiJest, '#C21325'],
  figma: [FaFigma, '#F24E1E'],
  git: [FaGitAlt, '#F05032'],
  jenkins: [FaJenkins, '#D24939'],
}

export default function SkillIcon({ name }) {
  const [Icon, color] = map[name] || [FaReact, '#fff']
  return <Icon color={color} />
}
