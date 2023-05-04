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
        <div className='text-2xl text-center flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-cyan-900 to-purple-900'>

            <div className='w-full'>
                <div className='flex flex-col w-1/2 lg:w-1/3 min-w-fit mx-auto'>
                    <div className='flex flex-row mx-auto border border-amber-500 rounded w-full'>
                        <input
                            type="text"
                            className='block min-h-[auto] h-10 w-full rounded border-0 bg-clip-text bg-gradient-to-t from-red-400 to-blue-400 text-white/50 font-serif font-bold px-3 outline-none hover:border hover:border-yellow-400 focus:bg-amber-500/20 focus:border focus:border-amber-400 placeholder:hover:text-white/50'
                            onChange={(e)=>setSearchText(e.target.value)}
                            placeholder={'SEARCH'}
                            value={searchText}/>

                    </div>
                    <button className='bg-transparent hover:bg-blue-300/20 w-fit h-fit mx-auto mb-2 py-1 px-4 rounded mt-2 font-mono border border-blue-300 text-blue-300 active:bg-lime-200/20 active:border-lime-300 hover:text-lime-300 transition-all duration-200' onClick={()=>handleSubmit()}>SEARCH</button>
                </div>
                <div className='text-sky-300 border-2 border-sky-300/50 pb-2 mx-auto w-fit px-4 rounded hover:border-blue-300'>
                    <span onClick={()=>setOptions(!options)} className='cursor-pointer text-xl w-fit px-4 rounded my-2 hover:text-lime-300 active:text-amber-300 transition-all duration-200'>Advanced Options {options?" ↑":" ↓"}</span>
                    <div className={`transition-all duration-1000 mt-2 ${options?"flex flex-col":"hidden"}`}>
                        <div className='flex flex-row mx-auto border border-amber-500 rounded  my-1 h-fit'>
                            <input
                                type="text"
                                className='block min-h-[auto] h-10 w-full rounded border-0 bg-clip-text bg-gradient-to-t from-red-400 to-blue-400 text-white/50 font-serif font-bold px-3 outline-none hover:border hover:border-yellow-400 focus:bg-amber-500/20 focus:border focus:border-amber-400 placeholder:hover:text-white/50'
                                onChange={(e)=>setTitle(e.target.value)}
                                placeholder='Title'
                                value={title}/>

                        </div>
                        <div className='flex flex-row mx-auto border border-amber-500 rounded  my-1 h-fit'>
                            <input
                                type="text"
                                className='block min-h-[auto] h-10 w-full rounded border-0 bg-clip-text bg-gradient-to-t from-red-400 to-blue-400 text-white/50 font-serif font-bold px-3 outline-none hover:border hover:border-yellow-400 focus:bg-amber-500/20 focus:border focus:border-amber-400 placeholder:hover:text-white/50'
                                onChange={(e)=>setAuthor(e.target.value)}
                                placeholder='Author'
                                value={author}/>

                        </div>
                        <div className='flex flex-row mx-auto border border-amber-500 rounded  my-1 h-fit'>
                            <input
                                type="text"
                                className='block min-h-[auto] h-10 w-full rounded border-0 bg-clip-text bg-gradient-to-t from-red-400 to-blue-400 text-white/50 font-serif font-bold px-3 outline-none hover:border hover:border-yellow-400 focus:bg-amber-500/20 focus:border focus:border-amber-400 placeholder:hover:text-white/50'
                                onChange={(e)=>setPublisher(e.target.value)}
                                placeholder='Publisher'
                                value={publisher}/>

                        </div>
                        <div className='flex flex-row mx-auto border border-amber-500 rounded  my-1 h-fit'>
                            <input
                                type="text"
                                className='block min-h-[auto] h-10 w-full rounded border-0 bg-clip-text bg-gradient-to-t from-red-400 to-blue-400 text-white/50 font-serif font-bold px-3 outline-none hover:border hover:border-yellow-400 focus:bg-amber-500/20 focus:border focus:border-amber-400 placeholder:hover:text-white/50'
                                onChange={(e)=>setSubject(e.target.value)}
                                placeholder='Subject'
                                value={subject}/>
                        </div>
                    </div>
                </div>

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
