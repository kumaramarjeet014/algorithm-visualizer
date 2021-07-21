import React, { useState, useEffect, useRef} from "react";
import useSound from "use-sound";
import beepSound from "../sound/beepSound.wav";
import beepSound2 from "../sound/beepSound2.wav";

import Toggle from "react-toggle";
import "react-toggle/style.css";

const ARRAYSIZE = 100;
const SortingVisualizer = () => {
    //Array Used to Sort
    const [primaryArray, setPrimaryArray] = useState([]);

    //Animated Speed
    const [animationSpeed, setAnimationSpeed] = useState(40);

    // add sound 
    const [soundOn, setSoundOn] = useState(true);

    //Algorithm Chosen
    const [algorithm, setAlgorithm] = useState({});

    // add sound effects
    const [playBeep1] = useSound(beepSound, { volume: soundOn ? 0.15 : 0});
    const [playBeep2] = useSound(beepSound2, { volume: soundOn ? 0.05 : 0});

    //Initial Random Array
    useEffect(() => {
        randomizeArray();
    }, []);

    /* Requires: Array size is set
    * Effect: Generates a random array with values from 20 to 400 and changes the array state
    */

    function randomizeArray() {
        for(let i = 0; i < primaryArray.length; i++ ) {
            let bar = document.getElementById(i).style;
            bar.backgroundColor = "#ff7f50";
        }
        let array = [];
        for(let i = 0; i < ARRAYSIZE; i++) {
            array.push(randomVals(20, 400));
        }

        setPrimaryArray(array);
    }

    // Generates a random val between min and max
    function randomVals(min, max) {
        let randomVal = Math.floor(Math.random() * (max - min + 1) + min);
        return randomVal;
    }

    //SLEEP FUNCTION --> Used to slow loop iteration
    const sleep = (miliseconds) => {
        return new Promise((resolve) => setTimeout(resolve, miliseconds));
    };

    //ANIMATION FOR WHEN THE SORTING IS FINISHED
    async function finishedAnimation() {
        console.log(primaryArray.length);
        for (let i = 0; i < primaryArray.length; i++) {
            let bar = document.getElementById(i).style;
            bar.backgroundColor = "green";
            // add sound here
            playBeep1();
            await sleep(animationSpeed);
        }
    }

    // --------------- ALGORITHMS -----------  //

    // --------------- BUBBLE SORT -----------  //
    async function bubbleSort() {
        let currentArray = primaryArray;

        let sorted = false;

        setAlgorithm({ name: "Bubble Sort", timeComplexity: "O(n^2)" });

        while (!sorted) {
            sorted = true;

            for (let i = 0; i < currentArray.length - 1; i++) {
                if (currentArray[i] > currentArray[i + 1]) {
                    let swap1 = currentArray[i];
                    let swap2 = currentArray[i + 1];
                    currentArray[i] = swap2;
                    currentArray[i + 1] = swap1;
                    setPrimaryArray([...primaryArray, currentArray]);

                    //Changes the Style while swapping
                    let bar1 = document.getElementById(i).style;
                    let bar2 = document.getElementById(i + 1).style;
                    bar1.backgroundColor = "#DC143C";
                    bar2.backgroundColor = "#6A5ACD";

                    await sleep(animationSpeed);

                    //Changes the Style back to original
                    bar1.backgroundColor = "#FF7F50";
                    bar2.backgroundColor = "#FF7F50";

                    sorted = false;
                    playBeep1();
                }
                playBeep2();
            }
            if ( sorted ) finishedAnimation();
        }
    }


    //   -------------------- HEAP SORT ------------------    //
    async function heapSort() {
        let currentArray = primaryArray;

        let len = currentArray.length;
        let index = Math.floor( (len / 2) - 1); //This is always the last parent in a heap
        let lastChild = len - 1;

        setAlgorithm({ name: "Heap Sort", timeComplexity: "O(nlog(n))" });

        while(index >= 0) {
            heapify(currentArray, len, index);
            index--;

            setPrimaryArray([...primaryArray, currentArray]);

            //Changes the style while swapping
            if(index >= 0) {
                let bar1 = document.getElementById(index).style;
                let bar2 = document.getElementById(index + 1).style;
                bar1.backgroundColor = "#DC143C";
                bar2.backgroundColor = "#6A5ACD";

                await sleep(animationSpeed);

                playBeep1();
                //Changes the style back to original
                bar1.backgroundColor = "#FF7F50";
                bar2.backgroundColor = "#FF7F50";
            }
            else{
                await sleep(animationSpeed);
            }
        }

        while (lastChild >= 0) {
            let swap1 = currentArray[0];
            let swap2 = currentArray[lastChild];

            currentArray[0] = swap2;
            currentArray[lastChild] = swap1;
            heapify(currentArray, lastChild, 0);
            lastChild--;
            playBeep2();

            setPrimaryArray([...primaryArray, currentArray]);

            //Changes the Style while swapping
            if (index >= 0) {
                let bar1 = document.getElementById(lastChild).style;
                let bar2 = document.getElementById(0).style;
                bar1.backgroundColor = "#DC143C";
                bar2.backgroundColor = "#6A5ACD";

                //Changes the style back to original
                bar1.backgroundColor = "#FF7F50";
                bar2.backgroundColor = "#FF7F50";
            }
            else{
                await sleep(animationSpeed);
            }
        }

        // setTimeout(finishedAnimation, 2500);
        finishedAnimation();
    }

    async function heapify(currentArray, len, index) {
        //Represents largest node out of the three
        let largest = index;

        //left child
        let leftNode = index * 2 + 1;
        //Right child
        let rightNode = leftNode + 1;

        //Check if left is largest, check if reached end
        if(currentArray[leftNode] > currentArray[largest] && leftNode < len) {
            largest = leftNode;
        }

        //Check if right is largest, check if reached end
        if(currentArray[rightNode] > currentArray[largest] && rightNode < len) {
            largest = rightNode;
        }

        //Check if parent is still largest, if not: perform a swap between the smallest and the largest
        if(largest !== index) {
            let swap1 = currentArray[index];
            let swap2 = currentArray[largest];

            currentArray[index] = swap2;
            currentArray[largest] = swap1;

            heapify(currentArray, len, largest);
        }

        return currentArray;
    }

    /* MERGE SORT
    
    *  Splits array recursively until individual elments are set,
    *  Merge everything back while sorting.
    * Time complexity = O(nlog(n))
    
    */

   /* function mergeSort() {
        let currentArray = primaryArray;
        setAlgorithm({ name: "Merge Sort", timeComplexity: "O(long(n))"});
        if(currentArray.length <= 1) return;
        const auxiliaryArray = currentArray.slice();

        //Call helper function with current sliced array
        mergeSortHelper(currentArray, 0, currentArray.length - 1, auxiliaryArray);

        
    }

    async function mergeSortHelper(mainArray, startIdx, endIdx, auxiliaryArray) {
        if(startIdx === endIdx) return;

        //Get sliced array and recursively divide it untill it has single element arrays
        const middleIdx = Math.floor(startIdx + ((endIdx - startIdx) / 2));
        mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray);
        mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray);

        await sleep(animationSpeed);
        playBeep2();
        doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray);
    }

    //Performs merging
    function doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray) {
        let k = startIdx;
        let i = startIdx;
        let j = middleIdx + 1;

        while (i <= middleIdx && j <= endIdx ) {
            playBeep1();
            if (auxiliaryArray[i] <= auxiliaryArray[j]) {
            //Compare values and overwrite primary array with new sorted array
                mainArray[k++] = auxiliaryArray[i++];
                setPrimaryArray([...primaryArray, mainArray]);
                let bar1 = document.getElementById(k).style;
                let bar2 = document.getElementById(i).style;
                bar1.backgroundColor = "#DC143C";
                bar2.backgroundColor = "#6A5ACD";

                setTimeout(() => {
                    bar1.backgroundColor = "#FF7F50";
                    bar1.backgroundColor = "#FF7F50";
                }, 800);
            }
            else {
                //Compare values and overwrite primary array with new sorted array
                mainArray[k++] = auxiliaryArray[j++];
                setPrimaryArray([...primaryArray, mainArray]);
                let bar1 = document.getElementById(k).style;
                let bar2 = document.getElementById(i).style;
                bar1.backgroundColor = "#DC143C";
                bar2.backgroundColor = "#6A5ACD";
                setTimeout(() => {
                    bar1.backgroundColor = "#FF7F50";
                    bar2.backgroundColor = "#FF7F50";
                }, 200);
            }
        }

        mergeBack(i, j, k, middleIdx, endIdx, mainArray, auxiliaryArray);
    }

    //MergeBack and fill the sorted Array
    function mergeBack(i, j, k, midIndex, endIndex, mainArray, auxiliaryArray) {
        while (i <= midIndex) {
            mainArray[k++] = auxiliaryArray[j++];
            setPrimaryArray([...primaryArray, mainArray]);
        }
        while (j <= endIndex) {
            mainArray[k++] = auxiliaryArray[j++];
            setPrimaryArray([...primaryArray, mainArray]);
        }
    }*/
    function mergeSort(array) {
        setAlgorithm({ name: "Merge Sort", timeComplexity: "O(nlog(n))" });
        if (array.length <= 1) return array;
        const auxiliaryArray = array.slice();
    
        //Call helper function with current sliced array
        mergeSortHelper(array, 0, array.length - 1, auxiliaryArray);
    
        return array;
      }
    
      async function mergeSortHelper(mainArray, startIdx, endIdx, auxiliaryArray) {
        if (startIdx === endIdx) return;
    
        //Get sliced array and recursively divide it untill it has single element arrays
        const middleIdx = Math.floor((startIdx + endIdx) / 2);
        mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray);
        mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray);
    
        await sleep(animationSpeed);
        playBeep2();
        doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray);
      }
    
      //Performs merging
      function doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray) {
        let k = startIdx;
        let i = startIdx;
        let j = middleIdx + 1;
    
        while (i <= middleIdx && j <= endIdx) {
          playBeep1();
          if (auxiliaryArray[i] <= auxiliaryArray[j]) {
            //Compare values and overwrite primary array with new sorted array
            mainArray[k++] = auxiliaryArray[i++];
            setPrimaryArray([...primaryArray, mainArray]);
            let bar1 = document.getElementById(k).style;
            let bar2 = document.getElementById(i).style;
            bar1.backgroundColor = "#DC143C";
            bar2.backgroundColor = "#6A5ACD";
    
            setTimeout(() => {
              bar1.backgroundColor = "#ff7f50";
              bar2.backgroundColor = "#ff7f50";
            }, 800);
          } else {
            //Compare values and overwrite primary array with new sorted array
            mainArray[k++] = auxiliaryArray[j++];
            setPrimaryArray([...primaryArray, mainArray]);
            let bar1 = document.getElementById(k).style;
            let bar2 = document.getElementById(i).style;
            bar1.backgroundColor = "#DC143C";
            bar2.backgroundColor = "#6A5ACD";
            setTimeout(() => {
              bar1.backgroundColor = "#ff7f50";
              bar2.backgroundColor = "#ff7f50";
            }, 200);
          }
        }
    
        mergeBack(i, j, k, middleIdx, endIdx, mainArray, auxiliaryArray);
      }
    
      //MergeBack and fill the sorted Array
      function mergeBack(i, j, k, midIndex, endIndex, mainArray, auxiliaryArray) {
        while (i <= midIndex) {
          mainArray[k++] = auxiliaryArray[i++];
          setPrimaryArray([...primaryArray, mainArray]);
        }
        while (j <= endIndex) {
          mainArray[k++] = auxiliaryArray[j++];
          setPrimaryArray([...primaryArray, mainArray]);
        }
      }

    //  --------------- Quick Sort  ---------------   //
    function quickSort() {
        setAlgorithm({ name: "Quick Sort", timeComplexity: "O(nlog(n))" });
        let currentArray = primaryArray;
        let left = 0;
        let right =  currentArray.length - 1;

        sort(currentArray, left, right);
        setTimeout(finishedAnimation, 2500);
    }

    async function sort(arr, left, right) {
        if(left < right) {
            let partitionIndex = partition(arr, left, right);

            setPrimaryArray([...primaryArray, arr]);
            await sleep(animationSpeed + 100);
            playBeep2();
            sort(arr, left, partitionIndex-1);
            sort(arr, partitionIndex + 1, right);
        }
    }

    function partition(arr, left, right) {
        let pivot = arr[right];
        let i = left - 1;
        playBeep1();
        for(let j = left; j < right; j++) {
            if(arr[j] < pivot) {
                i++;
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;

                let bar1 = document.getElementById(i).style;
                let bar2 = document.getElementById(j).style;
                bar1.backgroundColor = "#DC143C";
                bar2.backgroundColor = "#6A5ACD";

                setTimeout(() => {
                    bar1.backgroundColor = "#ff7f50";
                    bar2.backgroundColor = "#ff7f50";
                }, 200);

                setPrimaryArray([...primaryArray, arr]);
            }
        }

        let temp = arr[i + 1];
        arr[i + 1] = arr[right];
        arr[right] = temp;

        return i + 1;
    }

    //  ----------------  RADIX SORT  -----------------   //
    function radixCaller() {
        setAlgorithm({ name: "Radix Sort", timeComplexity: "O(log10(n))" });
        let currentArray = primaryArray;
        radixSort(currentArray);
    }

    async function radixSort(arr) {
        const max = getMax(arr);  //length of the max digit in the array

        for(let i = 0; i < max; i++) {
            let buckets = Array.from({ length: 10}, () => []);
            for(let j=0; j < arr.length; j++) {
                buckets[getPosition(arr[j], i)].push(arr[j]); //pushing into buckets
                let bar = document.getElementById(i).style;
                bar.backgroundColor = "#6A5ACD";
            }

            await sleep(animationSpeed + 300);

            let animArr = [];
            for(let c = 0; c < ARRAYSIZE/10; c++ ) {
                animArr.push(randomVals(0, ARRAYSIZE - 1))
            }

            animArr.forEach((val) => {
                let bar = document.getElementById(val).style;
                bar.backgroundColor = "#DC143C";
                playBeep1();
            });

            let animArr2 = [];
            for(let c = 0; c < ARRAYSIZE / 10; c++) {
                animArr2.push(randomVals(0, ARRAYSIZE - 1));
            }

            animArr2.forEach((val) => {
                let bar = document.getElementById(val).style;
                bar.backgroundColor = "#6A5ACD";
                playBeep2();
            });

            arr = [].concat(...buckets);
            setPrimaryArray(arr);

        }

        finishedAnimation();

        return arr;
    }

    function getMax(arr) {
        let max = 0;
        for (let num of arr) {
            if(max < num.toString().length) {
                max = num.toString().length;
            }
        }

        return max;
    }

    function getPosition(num, place) {
        let result = Math.floor(Math.abs(num) / Math.pow(10, place)) % 10;
        return result;
    }



    return (
        <div className="sortingVisualizer">
            <div className="header">
                {/* Algorithm Buttons */}
                <div className="headerBttns">
                    <button onClick={randomizeArray}>New Array</button>
                    <button onClick={bubbleSort}>Bubble Sort</button>
                    <button onClick={heapSort}>Heap Sort</button>
                    <button
                    onClick={() => {
                        mergeSort(primaryArray);
                        setTimeout(finishedAnimation, 2000);
                    }}
          >
            Merge Sort
          </button>
                    <button onClick={quickSort}>Quick Sort</button>
                    <button onClick={radixCaller}>Radix Sort</button>
                </div>
            </div>

            <div className="arrayControllers">
                <button id="restart" 
                    onClick={() => {
                        window.location.reload(false);
                    }}>{" "} 
                    Restart
                    </button>
                    <div id="velocity">
                        <button onClick={() => {setAnimationSpeed(80);}} 
                        id={animationSpeed === 80? "selected" : ""}>
                            Slow
                        </button>
                        <button onClick={() => {setAnimationSpeed(40);}}
                            id={animationSpeed === 40 ? "selected" : ""}>
                         Medium
                        </button>
                        <button onClick={() => {setAnimationSpeed(5);}} id={animationSpeed === 5 ? "selected" : ""}>
                            Fast
                        </button>
                    </div>
                    <div className="toggle">
                        <Toggle defaultChecked={soundOn}
                            icons={false}
                            onChange={() => {
                                setSoundOn(!soundOn);
                            }}
                        />
                        <span id="soundLabel">Sound {soundOn ? "On" : "Off"}</span>
                    </div>
            </div>
            <div className="arrayContainer">
                {primaryArray && primaryArray.map((val, key) => {
                    return (
                        <div className="bar"
                             id={key}
                             key={key}
                             style={{ height: val}}></div>
                    );
                })}
            </div>
            {algorithm.name != undefined && (
                <div className="algorithmInfo">
                    <>
                        <div id="name"> Algorithm: {algorithm.name}</div>
                        <div id="timeComplexity"> Time Complexity: {algorithm.timeComplexity}{" "}
                        </div>
                    </>
                </div>
            )}
        </div>
    );
}

export default SortingVisualizer;
