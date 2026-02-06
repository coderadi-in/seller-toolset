// ? IMPORTING OBSERVER
import { observer } from '../base/observer.js';

// ? GETTING DOC ELEMENTS
const heroSection = document.querySelector('.hero');
const toolsSection = document.querySelector('.tools');

// & PREPARING OBSERVABLES ARRAY
const observables = [heroSection, toolsSection];

// & OBSERVING ELEMENTS
observables.forEach((observable) => {
    observer.observe(observable)
})