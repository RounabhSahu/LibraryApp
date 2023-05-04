import React, {useEffect, useRef, useState} from 'react';

const ListView = ({data: oldData,searchQuery}) => {
    const pageRef = useRef(10);
    const baseUrl = 'https://www.googleapis.com/books/v1/volumes';
    const [data, setData] = useState(oldData.items);
    const [selected, setSelected] = useState(null);
    const [end, setEnd] = useState(false);
    const apiKey = 'AIzaSyANGY0cEkuAebB_iFkv3iH5bGcqs7t7si0';

    useEffect(() => {

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [searchQuery,pageRef.current]);


    useEffect(() => {
        setData(oldData.items)
        setEnd(false)
    }, [searchQuery,oldData.items]);



    const handleUpdate=(page)=>{

        if(!end){
            console.log(`${baseUrl}?q=${searchQuery}&startIndex=${page}&maxResults=5&key=${apiKey}`)
            fetch(`${baseUrl}?q=${searchQuery}&startIndex=${page}&maxResults=5&key=${apiKey}`)
                .then(response => response.json())
                .then(updatedData => {
                    if(updatedData.items===undefined){
                        setEnd(true)
                    }else{
                        setData((data)=> {
                            return [...data, ...updatedData.items]
                        })
                    }

                });
        }
    }
    const handleScroll = () => {
        if ( window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight ){
            handleUpdate(pageRef.current)
            pageRef.current=pageRef.current+5;
        }
    };
    return (
        <>
            <div className='bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-500'>Total Items Found : {oldData.totalItems}</div>
            {data.map((book,i)=>{
                return(
                    <div className='flex-0 shrink-0 flex-col flex-wrap py-2 my-1 rounded shrink-0 flex-0' key={i}>
                        <div className='flex flex-col justify-center items-center'>
                            <div className='mx-auto flex justify-center items-center'>
                                {book.volumeInfo.imageLinks===undefined?<div className="border border-yellow-500 flex justify-center items-center">No Image</div>:
                                    <img src={book.volumeInfo.imageLinks.thumbnail} alt="book title"/>}
                            </div>
                            <span
                                className='mx-auto hover:bg-sky-300/20 active:bg-amber-300/20 w-full cursor-pointer mt-2 text-sky-300/80 hover:text-lime-300/70 active:text-amber-300/80 rounded'
                                onClick={()=>{
                                if(i===selected){
                                    setSelected(null)
                                }
                                else{
                                    setSelected(i)
                                }
                            }
                            }>Show Info {selected===i?" ↑":" ↓"}</span>
                        </div>
                        <div className={`flex-col shrink-0 text-sm md:text-lg lg:text-2xl text-left p-2 rounded-b border border-sky-200 text-sky-200 ${selected===i?"flex":"hidden"}`}>
                            <span>Title :  {book.volumeInfo.title}</span>
                            {book.volumeInfo.subtitle===undefined?null:<span>Subtitle :  {book.volumeInfo.subtitle}</span>}
                            {book.volumeInfo.authors===undefined?null:<span>Author (s) : {book.volumeInfo.authors.join(', ')}</span>}
                            {book.volumeInfo.publisher===undefined?null:<span>Publisher :  {book.volumeInfo.publisher}</span>}
                            {book.volumeInfo.publishedDate===undefined?null:<span>Published Date :  {book.volumeInfo.publishedDate}</span>}
                            {book.volumeInfo.categories===undefined?null:<span>Category (s) : {book.volumeInfo.categories.join(', ')}</span>}
                        </div>

                    </div>
                )
            })}
            {end?<div className='my-2 text-white'>
                Reached End Of List
            </div>:null}
        </>
    );
};

export default React.memo(ListView);
