import React, {useEffect, useRef, useState} from 'react';

const ListView = ({data: oldData,searchQuery}) => {
    const pageRef = useRef(10);
    const baseUrl = 'https://www.googleapis.com/books/v1/volumes';
    const [data, setData] = useState(oldData.items);
    const apiKey = 'AIzaSyANGY0cEkuAebB_iFkv3iH5bGcqs7t7si0';

    useEffect(() => {

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [searchQuery,pageRef.current]);


    useEffect(() => {
        setData(oldData.items)
    }, [searchQuery,oldData.items]);



    const handleUpdate=(page)=>{
        console.log(`${baseUrl}?q=${searchQuery}&startIndex=${page}&maxResults=5&key=${apiKey}`)
        fetch(`${baseUrl}?q=${searchQuery}&startIndex=${page}&maxResults=5&key=${apiKey}`)
            .then(response => response.json())
            .then(updatedData => {
                setData((data)=> {
                    return [...data, ...updatedData.items]
                })
            });
    }
    const handleScroll = () => {
        if ( window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight ){
            handleUpdate(pageRef.current)
            pageRef.current=pageRef.current+5;
        }
    };
    return (
        <>
            <div>Total searched items : {oldData.totalItems}</div>
            {data.map((book,i)=>{
                return(
                    <div className='flex-1 flex-row flex-wrap border border-yellow-500 py-2' key={i}>
                        {book.volumeInfo.imageLinks===undefined?<div className="border border-yellow-500 h-[150px] w-[150px]">No Image</div>:
                            <img src={book.volumeInfo.imageLinks.thumbnail} alt="book title"/>}
                        <div className='flex flex-col'>
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
        </>
    );
};

export default React.memo(ListView);
