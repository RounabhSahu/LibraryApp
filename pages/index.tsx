import React, {useState} from 'react';
import Swal from 'sweetalert2';
import ListView from '../components/ListView';
import Loading from '../components/loading';
const Home = () => {
    const apiKey = 'AIzaSyANGY0cEkuAebB_iFkv3iH5bGcqs7t7si0';
    const [searchText, setSearchText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [publisher, setPublisher] = useState('');
    const [subject, setSubject] = useState('');
    const [empty, setEmpty] = useState(false);
    const [options, setOptions] = useState(false);
    const warn=(e)=>{
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: e,
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
            onOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
        })
    }

    const handleSubmit = () => {
        if (!searchText && !author && !title && !publisher && !subject) {
            warn('All fields are empty');
        } else {
            let tempUrl='';
            setSearchQuery(searchText);
            let x = []
            if (author){
                x.push(`inauthor:${author}`)
            }
            if (title){
                x.push(`intitle:${title}`)
            }
            if (publisher){
                x.push(`inpublisher:${publisher}`)
            }
            if (subject){
                x.push(`insubject:${subject}`)
            }
            if(searchText && x.length>0){
                setSearchQuery(`${searchText}+${x.join('+')}`)
                tempUrl=`https://www.googleapis.com/books/v1/volumes?q=${searchText}+${x.join('+')}&startIndex=0&maxResults=10&key=${apiKey}`;
            }else {
                if (searchText) {
                    setSearchQuery(`${searchText}`)
                    tempUrl = `https://www.googleapis.com/books/v1/volumes?q=${searchText}&startIndex=0&maxResults=10&key=${apiKey}`;
                } else {
                    setSearchQuery(`${x.join('+')}`)
                    tempUrl = `https://www.googleapis.com/books/v1/volumes?q=${x.join('+')}&startIndex=0&maxResults=10&key=${apiKey}`;
                }
            }
            // Swal.fire({
            //     title: 'Loading...',
            //     html: '<img src="https://stock.adobe.com/in/images/loading-circle-sign-vector-isolated/260135521" />',
            //     showConfirmButton: false,
            // });
            setLoading(true);

            // setSearchQuery(searchText); // set searchQuery to searchText
            fetch(tempUrl)
                .then(response => response.json())
                .then(data => {
                    // Swal.close();
                    setLoading(false);
                    if(data.totalItems===0){
                        console.log('emptry set true')
                        setEmpty(true)
                    }
                    else{
                        console.log('emptry set false')
                        setEmpty(false)
                        setData(data);
                    }
                });
        }
    };




    return (
        <div className='text-2xl text-center flex flex-col justify-center items-center min-h-screen'>

            <div>
                <div className='flex flex-row mx-auto border border-amber-500 rounded p-2'>
                    <input
                        type="text"
                        className='border border-yellow-400 rounded-l pl-2'
                        onChange={(e)=>setSearchText(e.target.value)}
                        value={searchText}/>
                    <button className='bg-blue-500 p-2 rounded-r' onClick={()=>handleSubmit()}>Search</button>
                </div>
                <div>Advanced Options <span onClick={()=>setOptions(!options)} className='cursor-pointer'>{options?"↓":"↑"}</span></div>
            </div>
            <div className={`transition-all duration-1000 ${options?"flex flex-col":"hidden"}`}>
                <div className='flex flex-row mx-auto border border-amber-500 rounded p-2'>
                    <input
                        type="text"
                        className='border border-yellow-400 rounded-l pl-2'
                        onChange={(e)=>setTitle(e.target.value)}
                        placeholder='Title'
                        value={title}/>

                </div>
                <div className='flex flex-row mx-auto border border-amber-500 rounded p-2'>
                    <input
                        type="text"
                        className='border border-yellow-400 rounded-l pl-2'
                        onChange={(e)=>setAuthor(e.target.value)}
                        placeholder='Author'
                        value={author}/>

                </div>
                <div className='flex flex-row mx-auto border border-amber-500 rounded p-2'>
                    <input
                        type="text"
                        className='border border-yellow-400 rounded-l pl-2'
                        onChange={(e)=>setPublisher(e.target.value)}
                        placeholder='Publisher'
                        value={publisher}/>

                </div>
                <div className='flex flex-row mx-auto border border-amber-500 rounded p-2'>
                    <input
                        type="text"
                        className='border border-yellow-400 rounded-l pl-2'
                        onChange={(e)=>setSubject(e.target.value)}
                        placeholder='Subject'
                        value={subject}/>
                </div>
                <button className='bg-blue-500 p-2 rounded' onClick={()=>handleSubmit()}>Search</button>
            </div>
            {loading? <Loading></Loading> :null}
            {data===null  || empty ?null:<div className="flex flex-col">
                <ListView data={data} searchQuery={searchQuery} searchText={searchText}></ListView>
            </div>}
            {
                empty && <div>No Results Found</div>
            }
        </div>
    );
};

export default Home;
