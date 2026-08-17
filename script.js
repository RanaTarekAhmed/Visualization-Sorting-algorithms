const container = document.getElementById('container');
const sizeSlider = document.getElementById('size');
const sizeValue = document.getElementById('sizeValue');
const speedSlider = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');
const generateBtn = document.getElementById('generate');
const startBtn = document.getElementById('start');
const algorithmSelect = document.getElementById('algorithm');

let array = [];
let isSorting = false;

function getDelay(){
  const speed = +speedSlider.value;
  return Math.max(5, 1000 - speed * 9);
}

function generateArray(n = +sizeSlider.value){
  array = [];
  for(let i=0;i<n;i++) array.push(Math.floor(Math.random()*100)+5);
  renderArray();
}

function renderArray(){
  container.innerHTML = '';
  const max = Math.max(...array);
  array.forEach((v,i)=>{
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = (v / max * 100) + '%';
    bar.dataset.index = i;
    container.appendChild(bar);
  });
}

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

async function swap(i,j){
  [array[i], array[j]] = [array[j], array[i]];
  const bars = container.children;
  const max = Math.max(...array);
  bars[i].style.height = (array[i]/max*100) + '%';
  bars[j].style.height = (array[j]/max*100) + '%';
  bars[i].classList.add('swapping');
  bars[j].classList.add('swapping');
  await sleep(getDelay());
  bars[i].classList.remove('swapping');
  bars[j].classList.remove('swapping');
}

async function bubbleSort(){
  const n = array.length;
  for(let i=0;i<n;i++){
    for(let j=0;j<n-i-1;j++){
      if(!isSorting) return;
      const bars = container.children;
      bars[j].classList.add('compare');
      bars[j+1].classList.add('compare');
      await sleep(getDelay());
      if(array[j] > array[j+1]) await swap(j,j+1);
      bars[j].classList.remove('compare');
      bars[j+1].classList.remove('compare');
    }
    container.children[n-i-1].classList.add('sorted');
  }
}

async function selectionSort(){
  const n = array.length;
  for(let i=0;i<n;i++){
    let min = i;
    container.children[min].classList.add('compare');
    for(let j=i+1;j<n;j++){
      if(!isSorting) return;
      container.children[j].classList.add('compare');
      await sleep(getDelay());
      if(array[j] < array[min]){
        container.children[min].classList.remove('compare');
        min = j;
        container.children[min].classList.add('compare');
      } else {
        container.children[j].classList.remove('compare');
      }
    }
    if(min !== i) await swap(i,min);
    container.children[i].classList.remove('compare');
    container.children[i].classList.add('sorted');
  }
}

async function partition(l,r){
  const pivot = array[r];
  let i = l;
  for(let j=l;j<r;j++){
    if(!isSorting) return i;
    const bars = container.children;
    bars[j].classList.add('compare');
    bars[r].classList.add('pivot');
    await sleep(getDelay());
    if(array[j] < pivot){
      await swap(i,j);
      i++;
    }
    bars[j].classList.remove('compare');
    bars[r].classList.remove('pivot');
  }
  await swap(i,r);
  container.children[i].classList.add('sorted');
  return i;
}

async function quickSort(l=0,r=array.length-1){
  if(l < r){
    const p = await partition(l,r);
    if(!isSorting) return;
    await quickSort(l,p-1);
    await quickSort(p+1,r);
  } else if(l === r){
    container.children[l].classList.add('sorted');
  }
}

function disableUI(state){
  sizeSlider.disabled = state;
  generateBtn.disabled = state;
  algorithmSelect.disabled = state;
  startBtn.disabled = state && state;
}

async function startSort(){
  if(isSorting) return;
  isSorting = true;
  disableUI(true);
  const algo = algorithmSelect.value;
  if(algo === 'Bubble Sort') await bubbleSort();
  else if(algo === 'Selection Sort') await selectionSort();
  else if(algo === 'Quick Sort') await quickSort();
  isSorting = false;
  for(const b of container.children) b.classList.add('sorted');
  disableUI(false);
}

sizeSlider.addEventListener('input', ()=>{sizeValue.textContent = sizeSlider.value});
speedSlider.addEventListener('input', ()=>{speedValue.textContent = speedSlider.value});
generateBtn.addEventListener('click', ()=>{generateArray();});
startBtn.addEventListener('click', ()=>{startSort();});

window.addEventListener('load', ()=>{generateArray();});
