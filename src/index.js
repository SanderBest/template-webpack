import * as $ from 'jquery';
import Post from '@models/post';
import './css/style.css';
import './css/scss.scss';
import WebpackLogo from './img/webpack-logo';
import xml from './assets/data.xml';
import csv from './assets/data.csv';
import './babel';

const post = new Post('webpack post title', WebpackLogo);

// console.log("post", post.toString());
// console.log("xml", xml);
console.log('csv', csv);
$('pre').html(post.toString());
