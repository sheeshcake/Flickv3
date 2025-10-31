import { View, StyleSheet, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { WebView } from "react-native-webview";

const TudumAnimation = ({ navigation, onComplete }) => {
	const [htmlContent, setHtmlContent] = useState("");

	useEffect(() => {
		// Load HTML and CSS content
		const loadWebContent = async () => {
			try {
				// For web assets, we'll embed the HTML and CSS directly
				const html = `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Netflix Intro</title>
					<style>
                    						* {
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
						html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #000000;
  overflow: hidden;
}
#container netflixintro {
  display: block;
  position: relative;
  width: 300px;
  height: 300px;
  overflow: hidden;
  animation-name: zoom-in;
  animation-delay: 0.5s;
  animation-duration: 3.5s;
  animation-timing-function: ease-in;
  animation-fill-mode: forwards;
  background-size: 4000px;
  background-position: -1950px 0;
}
#container netflixintro::before {
  content: "";
  position: absolute;
  display: block;
  background-color: #000000;
  width: 150%;
  height: 30%;
  left: -25%;
  bottom: -27%;
  border-radius: 50%;
  z-index: 5;
  transform-origin: left center;
  background-size: 4000px;
  background-position: -1950px 0;
}
#container netflixintro[letter=N] {
  transform-origin: 30% center;
}
#container netflixintro[letter=N] .helper-1 {
  width: 19.5%;
  height: 100%;
  background-color: rgba(228, 9, 19, 0.5);
  left: 22.4%;
  top: 0;
  transform: rotate(180deg);
  animation-name: fading-lumieres-box;
  animation-duration: 2s;
  animation-delay: 0.6s;
  animation-fill-mode: forwards;
}
#container netflixintro[letter=N] .helper-1 .effect-brush {
  animation-name: brush-moving;
  animation-duration: 2.5s;
  animation-fill-mode: forwards;
  animation-delay: 1.2s;
}
#container netflixintro[letter=N] .helper-1 .effect-brush [class*=fur-] {
  bottom: 0;
  height: 40%;
}
#container netflixintro[letter=N] .helper-3 {
  width: 19%;
  height: 150%;
  left: 40.5%;
  top: -25%;
  transform: rotate(-19.5deg);
  box-shadow: 0px 0px 35px -12px rgba(0, 0, 0, 0.4);
  overflow: hidden;
}
#container netflixintro[letter=N] .helper-3 .effect-brush {
  animation-name: brush-moving;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-delay: 0.8s;
}
#container netflixintro[letter=N] .helper-2 {
  width: 19.5%;
  height: 100%;
  left: 57.8%;
  top: 0;
  transform: rotate(180deg);
  overflow: hidden;
}
#container netflixintro[letter=N] .helper-2 .effect-brush {
  animation-name: brush-moving;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-delay: 0.5s;
}
#container netflixintro[letter=E] {
  transform-origin: 30% center;
}
#container netflixintro[letter=E] .helper-1 {
  width: 19.5%;
  height: 100%;
  background-color: rgba(228, 9, 19, 0.5);
  left: 22%;
  top: 0;
  transform: rotate(180deg);
  animation-name: fading-lumieres-box;
  animation-duration: 2s;
  animation-delay: 0.6s;
  animation-fill-mode: forwards;
}
#container netflixintro[letter=E] .helper-1 .effect-brush {
  animation-name: brush-moving;
  animation-duration: 2.5s;
  animation-fill-mode: forwards;
  animation-delay: 1.2s;
}
#container netflixintro[letter=E] .helper-1 .effect-brush [class*=fur-] {
  bottom: 0;
  height: 40%;
}
#container netflixintro[letter=E] .helper-2 {
  width: 17.5%;
  height: 50%;
  left: 38%;
  top: -49px;
  transform: rotate(270deg);
  overflow: hidden;
}
#container netflixintro[letter=E] .helper-2 .effect-brush {
  animation-name: brush-moving;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-delay: 0.8s;
}
#container netflixintro[letter=E] .helper-3 {
  width: 17%;
  height: 39%;
  left: 33%;
  top: 29%;
  transform: rotate(-90deg);
  box-shadow: 0px 0px 35px -12px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  animation-name: fading-out;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-delay: 1s;
}
#container netflixintro[letter=E] .helper-3 .effect-brush {
  animation-name: brush-moving;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-delay: 0.6s;
}
#container netflixintro[letter=E] .helper-4 {
  width: 17.5%;
  height: 50%;
  left: 38%;
  top: 196px;
  transform: rotate(270deg);
  overflow: hidden;
}
#container netflixintro[letter=E] .helper-4 .effect-brush {
  animation-name: brush-moving;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-delay: 0.4s;
  animation-delay: 0.5s;
}
#container netflixintro[letter=T] {
  transform-origin: center center;
}
#container netflixintro[letter=T] .helper-1 {
  width: 19.5%;
  height: 100%;
  background-color: rgba(228, 9, 19, 0.5);
  left: 38%;
  top: 0;
  transform: rotate(180deg);
  animation-name: fading-lumieres-box;
  animation-duration: 2s;
  animation-delay: 0.6s;
  animation-fill-mode: forwards;
}
#container netflixintro[letter=T] .helper-1 .effect-brush {
  animation-name: brush-moving;
  animation-duration: 2.5s;
  animation-fill-mode: forwards;
  animation-delay: 1s;
}
#container netflixintro[letter=T] .helper-1 .effect-brush [class*=fur-] {
  bottom: 0;
  height: 40%;
}
#container netflixintro[letter=T] .helper-2 {
  width: 17.5%;
  height: 54%;
  left: 39%;
  top: -55px;
  transform: rotate(270deg);
  overflow: hidden;
}
#container netflixintro[letter=T] .helper-2 .effect-brush {
  animation-name: brush-moving;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-delay: 0.5s;
}
#container netflixintro[letter=F] {
  transform-origin: 30% center;
}
#container netflixintro[letter=F] .helper-1 {
  width: 19.5%;
  height: 100%;
  background-color: rgba(228, 9, 19, 0.5);
  left: 20%;
  top: 0;
  transform: rotate(180deg);
  animation-name: fading-lumieres-box;
  animation-duration: 2s;
  animation-delay: 0.6s;
  animation-fill-mode: forwards;
}
#container netflixintro[letter=F] .helper-1 .effect-brush {
  animation-name: brush-moving;
  animation-duration: 2.5s;
  animation-fill-mode: forwards;
  animation-delay: 1.2s;
}
#container netflixintro[letter=F] .helper-1 .effect-brush [class*=fur-] {
  bottom: 0;
  height: 40%;
}
#container netflixintro[letter=F] .helper-2 {
  width: 17.5%;
  height: 50%;
  left: 38%;
  top: -49px;
  transform: rotate(270deg);
  overflow: hidden;
}
#container netflixintro[letter=F] .helper-2 .effect-brush {
  animation-name: brush-moving;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-delay: 0.7s;
}
#container netflixintro[letter=F] .helper-3 {
  width: 17%;
  height: 39%;
  left: 33%;
  top: 29%;
  transform: rotate(-90deg);
  box-shadow: 0px 0px 35px -12px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  animation-name: fading-out;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-delay: 1s;
}
#container netflixintro[letter=F] .helper-3 .effect-brush {
  animation-name: brush-moving;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-delay: 0.5s;
}
#container netflixintro[letter=L] {
  transform-origin: 30% center;
}
#container netflixintro[letter=L] .helper-1 {
  width: 19.5%;
  height: 100%;
  background-color: rgba(228, 9, 19, 0.5);
  left: 22%;
  top: 0;
  transform: rotate(180deg);
  animation-name: fading-lumieres-box;
  animation-duration: 2s;
  animation-delay: 0.6s;
  animation-fill-mode: forwards;
}
#container netflixintro[letter=L] .helper-1 .effect-brush {
  animation-name: brush-moving;
  animation-duration: 2.5s;
  animation-fill-mode: forwards;
  animation-delay: 0.8s;
}
#container netflixintro[letter=L] .helper-1 .effect-brush [class*=fur-] {
  bottom: 0;
  height: 40%;
}
#container netflixintro[letter=L] .helper-2 {
  width: 17.5%;
  height: 50%;
  left: 38%;
  top: 196px;
  transform: rotate(270deg);
  overflow: hidden;
}
#container netflixintro[letter=L] .helper-2 .effect-brush {
  animation-name: brush-moving;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-delay: 0.4s;
}
#container netflixintro[letter=I] {
  transform-origin: center center;
}
#container netflixintro[letter=I] .helper-1 {
  width: 19.5%;
  height: 100%;
  background-color: rgba(228, 9, 19, 0.5);
  left: 38%;
  top: 0;
  transform: rotate(180deg);
  animation-name: fading-lumieres-box;
  animation-duration: 2s;
  animation-delay: 0.6s;
  animation-fill-mode: forwards;
}
#container netflixintro[letter=I] .helper-1 .effect-brush {
  animation-name: brush-moving;
  animation-duration: 2.5s;
  animation-fill-mode: forwards;
  animation-delay: 1s;
}
#container netflixintro[letter=I] .helper-1 .effect-brush [class*=fur-] {
  bottom: 0;
  height: 40%;
}
#container netflixintro[letter=X] {
  transform-origin: center center;
}
#container netflixintro[letter=X] .helper-1 {
  width: 19%;
  height: 150%;
  left: 40.5%;
  top: -25%;
  transform: rotate(-19.5deg);
  animation-name: fading-lumieres-box;
  animation-duration: 2s;
  animation-delay: 0.6s;
  animation-fill-mode: forwards;
}
#container netflixintro[letter=X] .helper-1 .effect-brush {
  animation-name: brush-moving;
  animation-duration: 2.5s;
  animation-fill-mode: forwards;
  animation-delay: 1.2s;
}
#container netflixintro[letter=X] .helper-1 .effect-brush [class*=fur-] {
  bottom: 0;
  height: 40%;
}
#container netflixintro[letter=X] .helper-2 {
  width: 19%;
  height: 150%;
  left: 40.5%;
  top: -25%;
  transform: rotate(19.5deg);
  overflow: hidden;
}
#container netflixintro[letter=X] .helper-2 .effect-brush {
  animation-name: brush-moving;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-delay: 0.5s;
}
#container netflixintro [class*=helper-] {
  position: absolute;
}
#container netflixintro [class*=helper-] .effect-brush {
  position: absolute;
  width: 100%;
  height: 300%;
  top: 0;
  overflow: hidden;
}
#container netflixintro [class*=helper-] .effect-brush::before {
  display: block;
  content: "";
  position: absolute;
  background-color: #e40913;
  width: 100%;
  height: 70%;
  box-shadow: 0px 0px 29px 24px #e40913;
}
#container netflixintro [class*=helper-] .effect-brush [class*=fur-] {
  display: block;
  position: absolute;
  bottom: 10%;
  height: 30%;
}
#container netflixintro [class*=helper-] .effect-brush .fur-1 {
  left: 0%;
  width: 3.8%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 15%, rgba(0, 0, 0, 0) 81%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-2 {
  left: 3.8%;
  width: 2.8%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 10%, rgba(0, 0, 0, 0) 62%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-3 {
  left: 6.6%;
  width: 4.8%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 37%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-4 {
  left: 11.4%;
  width: 4%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 23%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-5 {
  left: 15.4%;
  width: 4%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 15%, rgba(0, 0, 0, 0) 86%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-6 {
  left: 19.4%;
  width: 2.5%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 27%, rgba(0, 0, 0, 0) 89%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-7 {
  left: 21.9%;
  width: 4%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 20%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-8 {
  left: 25.9%;
  width: 2%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 30%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-9 {
  left: 27.9%;
  width: 4%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 35%, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-10 {
  left: 31.9%;
  width: 3.5%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 39%, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-11 {
  left: 35.4%;
  width: 2%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 34%, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-12 {
  left: 37.4%;
  width: 2.6%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 22%, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-13 {
  left: 40%;
  width: 6%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 47%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-14 {
  left: 46%;
  width: 2%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 36%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-15 {
  left: 48%;
  width: 5.5%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 29%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-16 {
  left: 53.5%;
  width: 3%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 39%, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-17 {
  left: 56.5%;
  width: 4.1%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 45%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-18 {
  left: 60.6%;
  width: 2.4%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 34%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-19 {
  left: 63%;
  width: 4%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 47%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-20 {
  left: 67%;
  width: 1.5%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 27%, rgba(0, 0, 0, 0) 95%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-21 {
  left: 68.5%;
  width: 2.8%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 37%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-22 {
  left: 71.3%;
  width: 2.3%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 9%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-23 {
  left: 73.6%;
  width: 2.2%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 28%, rgba(0, 0, 0, 0) 92%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-24 {
  left: 75.8%;
  width: 1%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 37%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-25 {
  left: 76.8%;
  width: 2.1%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 28%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-26 {
  left: 78.9%;
  width: 4.1%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 34%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-27 {
  left: 83%;
  width: 2.5%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 21%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-28 {
  left: 85.5%;
  width: 4.5%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 39%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-29 {
  left: 90%;
  width: 2.8%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 30%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-30 {
  left: 92.8%;
  width: 3.5%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 19%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-brush .fur-31 {
  left: 96.3%;
  width: 3.7%;
  background: linear-gradient(to bottom, #e40913 0%, #e40913 37%, rgba(0, 0, 0, 0) 100%);
}
#container netflixintro [class*=helper-] .effect-lumieres {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  animation-name: showing-lumieres;
  animation-duration: 2s;
  animation-delay: 1.6s;
  animation-fill-mode: forwards;
}
#container netflixintro [class*=helper-] .effect-lumieres [class*=lamp-] {
  position: absolute;
  display: block;
  height: 100%;
  box-shadow: 0px 0px 10px 0px rgba(228, 9, 19, 0.75);
  background: var(--color);
}
#container netflixintro [class*=helper-] .effect-lumieres [class*=lamp-]::before {
  position: absolute;
  content: " ";
  display: block;
  width: 100%;
  height: 100%;
  background: var(--color);
  box-shadow: 0px 0px 10px 0px rgba(228, 9, 19, 0.75);
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-1 {
  --color: #ff0100;
  z: 6;
  left: 0.7%;
  width: 1%;
  animation-delay: 0.94s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-1::before {
  left: 192%;
  animation-delay: 1.68s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-2 {
  --color: #ffde01;
  left: 2.2%;
  width: 1.4%;
  animation-delay: 1.51s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-2::before {
  left: 156%;
  animation-delay: 0.81s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-3 {
  --color: #ff00cc;
  left: 5.8%;
  width: 2.1%;
  animation-delay: 0.48s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-3::before {
  left: 15%;
  animation-delay: 0.75s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-4 {
  --color: #04fd8f;
  left: 10.1%;
  width: 2%;
  animation-delay: 0.93s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-4::before {
  left: 39%;
  animation-delay: 1.33s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-5 {
  --color: #ff0100;
  left: 12.9%;
  width: 1.4%;
  animation-delay: 0.1s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-5::before {
  left: 22%;
  animation-delay: 1.1s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-6 {
  --color: #ff9600;
  left: 15.3%;
  width: 2.8%;
  animation-delay: 1.27s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-6::before {
  left: 49%;
  animation-delay: 0.83s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-7 {
  --color: #0084ff;
  left: 21.2%;
  width: 2.5%;
  animation-delay: 0.63s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-7::before {
  left: 14%;
  animation-delay: 0.85s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-8 {
  --color: #f84006;
  left: 25%;
  width: 2.5%;
  animation-delay: 0.83s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-8::before {
  left: 121%;
  animation-delay: 1.72s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-9 {
  --color: #ffc601;
  left: 30.5%;
  width: 3%;
  animation-delay: 1.32s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-9::before {
  left: 110%;
  animation-delay: 0.46s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-10 {
  --color: #ff4800;
  left: 36.3%;
  width: 3%;
  animation-delay: 1.26s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-10::before {
  left: 192%;
  animation-delay: 0.06s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-11 {
  --color: #fd0100;
  left: 41%;
  width: 2.2%;
  animation-delay: 1.57s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-11::before {
  left: 149%;
  animation-delay: 1.4s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-12 {
  --color: #01ffff;
  left: 44.2%;
  width: 2.6%;
  animation-delay: 1.16s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-12::before {
  left: 37%;
  animation-delay: 1.85s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-13 {
  --color: #ffc601;
  left: 51.7%;
  width: 0.5%;
  animation-delay: 1.01s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-13::before {
  left: 78%;
  animation-delay: 0.77s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-14 {
  --color: #ffc601;
  left: 52.1%;
  width: 1.8%;
  animation-delay: 1.87s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-14::before {
  left: 23%;
  animation-delay: 1.74s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-15 {
  --color: #0078fe;
  left: 53.8%;
  width: 2.3%;
  animation-delay: 1.46s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-15::before {
  left: 33%;
  animation-delay: 1.19s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-16 {
  --color: #0080ff;
  left: 57.2%;
  width: 2%;
  animation-delay: 0.36s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-16::before {
  left: 105%;
  animation-delay: 1.86s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-17 {
  --color: #ffae01;
  left: 62.3%;
  width: 2.9%;
  animation-delay: 1.31s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-17::before {
  left: 106%;
  animation-delay: 1.16s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-18 {
  --color: #ff00bf;
  left: 65.8%;
  width: 1.7%;
  animation-delay: 1.15s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-18::before {
  left: 36%;
  animation-delay: 0.07s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-19 {
  --color: #a601f4;
  left: 72.8%;
  width: 0.8%;
  animation-delay: 1.46s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-19::before {
  left: 157%;
  animation-delay: 1.79s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-20 {
  --color: #f30b34;
  left: 74.3%;
  width: 2%;
  animation-delay: 1.22s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-20::before {
  left: 146%;
  animation-delay: 0.16s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-21 {
  --color: #ff00bf;
  left: 79.8%;
  width: 2%;
  animation-delay: 1.06s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-21::before {
  left: 81%;
  animation-delay: 1.01s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-22 {
  --color: #04fd8f;
  left: 78.2%;
  width: 2%;
  animation-delay: 1.13s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-22::before {
  left: 70%;
  animation-delay: 0.39s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-23 {
  --color: #01ffff;
  left: 78.5%;
  width: 2%;
  animation-delay: 0.64s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-23::before {
  left: 159%;
  animation-delay: 1.1s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-24 {
  --color: #a201ff;
  left: 85.3%;
  width: 1.1%;
  animation-delay: 1.06s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-24::before {
  left: 116%;
  animation-delay: 0.9s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-25 {
  --color: #ec0014;
  left: 86.9%;
  width: 1.1%;
  animation-delay: 1.86s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-25::before {
  left: 92%;
  animation-delay: 1.92s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-26 {
  --color: #0078fe;
  left: 88.8%;
  width: 2%;
  animation-delay: 0.68s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-26::before {
  left: 166%;
  animation-delay: 0.07s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-27 {
  --color: #ff0036;
  left: 92.4%;
  width: 2.4%;
  animation-delay: 0.56s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-27::before {
  left: 97%;
  animation-delay: 1.64s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-28 {
  --color: #06f98c;
  left: 96.2%;
  width: 2.1%;
  animation-delay: 0.37s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-28::before {
  left: 134%;
  animation-delay: 0.18s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-1,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-3,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-5,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-7,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-9,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-11,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-13,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-15,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-17,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-19,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-21,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-23,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-25,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-27 {
  animation-name: lumieres-moving-left;
  animation-duration: 5s;
  animation-fill-mode: forwards;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-1::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-3::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-5::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-7::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-9::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-11::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-13::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-15::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-17::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-19::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-21::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-23::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-25::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-27::before {
  animation-name: lumieres-moving-left;
  animation-duration: 5.5s;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-2,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-4,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-6,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-8,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-10,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-12,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-14,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-16,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-18,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-20,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-22,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-24,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-26,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-28 {
  animation-name: lumieres-moving-right;
  animation-duration: 5s;
  animation-fill-mode: forwards;
}
#container netflixintro [class*=helper-] .effect-lumieres .lamp-2::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-4::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-6::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-8::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-10::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-12::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-14::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-16::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-18::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-20::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-22::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-24::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-26::before,
#container netflixintro [class*=helper-] .effect-lumieres .lamp-28::before {
  animation-name: lumieres-moving-right;
  animation-duration: 5.5s;
}

@keyframes brush-moving {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
}
@keyframes fading-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes lumieres-moving-right {
  0% {
    transform: translate(0);
  }
  40% {
    transform: translate(-10px) scaleX(1);
  }
  50% {
    transform: translate(-60px);
  }
  100% {
    transform: translate(-120px) scaleX(3);
  }
}
@keyframes lumieres-moving-left {
  0% {
    transform: translate(0);
  }
  40% {
    transform: translate(10px) scaleX(1);
  }
  50% {
    transform: translate(60px);
  }
  100% {
    transform: translate(120px) scaleX(3);
  }
}
@keyframes zoom-in {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(15);
  }
}
@keyframes showing-lumieres {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes fading-lumieres-box {
  0% {
    background-color: rgba(228, 9, 19, 0.5);
  }
  100% {
    background-color: rgba(228, 9, 19, 0);
  }
}
					</style>
				</head>
				<body>
					<div id="container">
<!-- Edit the letter attr to: N, E, T, F, L, I or X -->
   <netflixintro letter="F">
    <div class="helper-1">
      <div class="effect-brush">
        <span class="fur-31"></span>
        <span class="fur-30"></span>
        <span class="fur-29"></span>
        <span class="fur-28"></span>
        <span class="fur-27"></span>
        <span class="fur-26"></span>
        <span class="fur-25"></span>
        <span class="fur-24"></span>
        <span class="fur-23"></span>
        <span class="fur-22"></span>
        <span class="fur-21"></span>
        <span class="fur-20"></span>
        <span class="fur-19"></span>
        <span class="fur-18"></span>
        <span class="fur-17"></span>
        <span class="fur-16"></span>
        <span class="fur-15"></span>
        <span class="fur-14"></span>
        <span class="fur-13"></span>
        <span class="fur-12"></span>
        <span class="fur-11"></span>
        <span class="fur-10"></span>
        <span class="fur-9"></span>
        <span class="fur-8"></span>
        <span class="fur-7"></span>
        <span class="fur-6"></span>
        <span class="fur-5"></span>
        <span class="fur-4"></span>
        <span class="fur-3"></span>
        <span class="fur-2"></span>
        <span class="fur-1"></span>
      </div>
      <div class="effect-lumieres">
        <span class="lamp-1"></span>
        <span class="lamp-2"></span>
        <span class="lamp-3"></span>
        <span class="lamp-4"></span>
        <span class="lamp-5"></span>
        <span class="lamp-6"></span>
        <span class="lamp-7"></span>
        <span class="lamp-8"></span>
        <span class="lamp-9"></span>
        <span class="lamp-10"></span>
        <span class="lamp-11"></span>
        <span class="lamp-12"></span>
        <span class="lamp-13"></span>
        <span class="lamp-14"></span>
        <span class="lamp-15"></span>
        <span class="lamp-16"></span>
        <span class="lamp-17"></span>
        <span class="lamp-18"></span>
        <span class="lamp-19"></span>
        <span class="lamp-20"></span>
        <span class="lamp-21"></span>
        <span class="lamp-22"></span>
        <span class="lamp-23"></span>
        <span class="lamp-24"></span>
        <span class="lamp-25"></span>
        <span class="lamp-26"></span>
        <span class="lamp-27"></span>
        <span class="lamp-28"></span>
      </div>
    </div>
    <div class="helper-2">
      <div class="effect-brush">
        <span class="fur-31"></span>
        <span class="fur-30"></span>
        <span class="fur-29"></span>
        <span class="fur-28"></span>
        <span class="fur-27"></span>
        <span class="fur-26"></span>
        <span class="fur-25"></span>
        <span class="fur-24"></span>
        <span class="fur-23"></span>
        <span class="fur-22"></span>
        <span class="fur-21"></span>
        <span class="fur-20"></span>
        <span class="fur-19"></span>
        <span class="fur-18"></span>
        <span class="fur-17"></span>
        <span class="fur-16"></span>
        <span class="fur-15"></span>
        <span class="fur-14"></span>
        <span class="fur-13"></span>
        <span class="fur-12"></span>
        <span class="fur-11"></span>
        <span class="fur-10"></span>
        <span class="fur-9"></span>
        <span class="fur-8"></span>
        <span class="fur-7"></span>
        <span class="fur-6"></span>
        <span class="fur-5"></span>
        <span class="fur-4"></span>
        <span class="fur-3"></span>
        <span class="fur-2"></span>
        <span class="fur-1"></span>
      </div>
    </div>
    <div class="helper-3">
      <div class="effect-brush">
        <span class="fur-31"></span>
        <span class="fur-30"></span>
        <span class="fur-29"></span>
        <span class="fur-28"></span>
        <span class="fur-27"></span>
        <span class="fur-26"></span>
        <span class="fur-25"></span>
        <span class="fur-24"></span>
        <span class="fur-23"></span>
        <span class="fur-22"></span>
        <span class="fur-21"></span>
        <span class="fur-20"></span>
        <span class="fur-19"></span>
        <span class="fur-18"></span>
        <span class="fur-17"></span>
        <span class="fur-16"></span>
        <span class="fur-15"></span>
        <span class="fur-14"></span>
        <span class="fur-13"></span>
        <span class="fur-12"></span>
        <span class="fur-11"></span>
        <span class="fur-10"></span>
        <span class="fur-9"></span>
        <span class="fur-8"></span>
        <span class="fur-7"></span>
        <span class="fur-6"></span>
        <span class="fur-5"></span>
        <span class="fur-4"></span>
        <span class="fur-3"></span>
        <span class="fur-2"></span>
        <span class="fur-1"></span>
      </div>
    </div>
    <div class="helper-4">
      <div class="effect-brush">
        <span class="fur-31"></span>
        <span class="fur-30"></span>
        <span class="fur-29"></span>
        <span class="fur-28"></span>
        <span class="fur-27"></span>
        <span class="fur-26"></span>
        <span class="fur-25"></span>
        <span class="fur-24"></span>
        <span class="fur-23"></span>
        <span class="fur-22"></span>
        <span class="fur-21"></span>
        <span class="fur-20"></span>
        <span class="fur-19"></span>
        <span class="fur-18"></span>
        <span class="fur-17"></span>
        <span class="fur-16"></span>
        <span class="fur-15"></span>
        <span class="fur-14"></span>
        <span class="fur-13"></span>
        <span class="fur-12"></span>
        <span class="fur-11"></span>
        <span class="fur-10"></span>
        <span class="fur-9"></span>
        <span class="fur-8"></span>
        <span class="fur-7"></span>
        <span class="fur-6"></span>
        <span class="fur-5"></span>
        <span class="fur-4"></span>
        <span class="fur-3"></span>
        <span class="fur-2"></span>
        <span class="fur-1"></span>
      </div>
    </div>
  </netflixintro>
</div>
<audio id="myAudio" style="display: none;" muted="false" autoplay>
        <source src="https://www.myinstants.com/media/sounds/nouveau-jingle-netflix.mp3" type="audio/mpeg">
        Your browser does not support the audio element.
    </audio>
					<script>
						function playAudio() {
							var audio = document.getElementById("myAudio");
							audio.muted = false;
							var playPromise = audio.play();
							
							// Handle potential play errors gracefully
							if (playPromise !== undefined) {
								playPromise.catch(function(error) {
									console.log("Audio playback failed:", error);
								});
							}
							
							// Remove listeners after first interaction
							document.removeEventListener("click", playAudio);
							document.removeEventListener("touchstart", playAudio);
						}
						
						window.onload = function() {
							// Play audio immediately when animation starts
							setTimeout(playAudio, 300);
							
							setTimeout(function() {
								window.ReactNativeWebView.postMessage(JSON.stringify({type: 'animationComplete'}));
							}, 4700);
						};
						
						// Add listeners for first user interaction as fallback
						document.addEventListener("click", playAudio);
						document.addEventListener("touchstart", playAudio);
					</script>
				</body>
				</html>
				`;
				setHtmlContent(html);
			} catch (error) {
				console.error("Error loading web content:", error);
			}
		};

		loadWebContent();
	}, []);

	const handleWebMessage = (event) => {
		try {
			const data = JSON.parse(event.nativeEvent.data);
			if (data.type === "animationComplete") {
				if (onComplete) {
					onComplete();
				} else if (navigation) {
					navigation.reset({
						index: 0,
						routes: [{ name: "Home" }],
					});
				}
			}
		} catch (error) {
			console.error("Error handling web message:", error);
		}
	};

	return (
		<View style={styles.container}>
			{htmlContent ? (
				<WebView
					source={{ html: htmlContent }}
					style={styles.webView}
					scalesPageToFit={true}
					scrollEnabled={false}
					onMessage={handleWebMessage}
                    mediaPlaybackRequiresUserAction={false}
                    allowsInlineMediaPlayback={true}
                    showsVerticalScrollIndicator={false}
					originWhitelist={["*"]}
				/>
			) : (
				<View style={styles.loadingContainer} />
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000",
		width: "100%",
		height: "100%",
		overflow: "hidden",
	},
	webView: {
		flex: 1,
		backgroundColor: "#000",
        height: "100%",
	},
	loadingContainer: {
		flex: 1,
		backgroundColor: "#000",
	},
});

export default TudumAnimation;