import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../Hooks/useFetch';
import { format } from 'date-fns';

const UpdateItemPage = () => {

  const {itemId} = useParams()
  const {data: item, isPending1, error1} = useFetch(`http://localhost:4000/api/item/${itemId}`)

  //const {actualItemGroup, isPending2, error2} = useFetch(`http://localhost:4000/api/collection/${item.group}`)

  
  const [collection, setCollection] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [itemType, setItemType] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [edition, setEdition] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [isbn, setIsbn] = useState('');
  const [pages, setPages] = useState('');
  const [duree, setDuree] = useState('');
  const [price, setPrice] = useState('');
  const [itemPicture, setItemPicture] = useState('');

  useEffect(() => {
    if (!isPending1 && item) {
        setSelectedCollection(item.group);
        setItemType(item.type);
        setTitle(item.titre);
        setAuthor(item.auteur);
        setDescription(item.description);
        setEdition(item.editor);
        setPublicationDate(format(new Date(item.publicationDate),'dd-MM-yyyy'));
        setIsbn(item.isbn);
        setPages(item.pageNumber);
        setDuree(item.duree);
        setPrice(item.price);
        setItemPicture(item.itemPicture);
    }
  }, [isPending1, item]);
  const types = ['image/png', 'image/jpeg']; // image types
  const userId = localStorage.getItem('user_id');
  const token = Cookies.get('token');

  const { data: userCollectionData, isPending, error } = useFetch(
    `http://localhost:4000/api/collection/${userId}`
  );

  useEffect(() => {
    if (!isPending && userCollectionData) {
      setCollection(userCollectionData);
    }
  }, [isPending, userCollectionData]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedItem;
    if (itemType === 'livre') {
      if (
        selectedCollection === 'Select a collection' ||
        title === '' ||
        author === '' ||
        edition === '' ||
        publicationDate === '' ||
        isbn === '' ||
        price === '' ||
        pages === ''
      ) {
        alert('Please fill out all the fields');
      } else {
        updatedItem = {
          ...item,
          group: selectedCollection,
          type: itemType,
          titre: title,
          auteur: author,
          description,
          editor: edition,
          publicationDate,
          isbn,
          price,
          pageNumber: pages,
          itemPicture,
        };
      }
    } else {
      if (
        selectedCollection === 'Select a collection' ||
        title === '' ||
        author === '' ||
        publicationDate === '' ||
        price === '' ||
        duree === ''
      ) {
        alert('Please fill out all the fields!');
      } else {
        updatedItem = {
          ...item,
          group: selectedCollection,
          type: itemType,
          titre: title,
          auteur: author,
          description,
          publicationDate,
          price,
          duree: duree,
          itemPicture,
        };
      }
    }

    console.log(updatedItem);

    try {
      const response = await fetch(
        `http://localhost:4000/api/item/${item._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedItem),
        }
      );

      const data = await response.json();
      console.log(data.message);
      if(response.ok){
        alert("item updated successfully")
        navigate('/MyLibrary')
      }
      if(!response.ok){
        alert("failed to load item")
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleItemPictureChange = (e) => {
    const file = e.target.files[0];
    console.log(file.size);
    if (!(file && types.includes(file.type))) {
      alert('Please select a valid image type (jpg or png)');
    }
    const reader = new FileReader();
    const maxFileSize = 5 * 1024 * 1024; // 5MB as maximum size of the item image
    if (file.size > maxFileSize) {
      alert('Picture size should not exceed 5MB');
      return;
    }
    reader.onloadend = () => {
      console.log('item Picture Read:', reader.result);
      setItemPicture(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h1 className="dark:text-white text-xl font-bold leading-tight tracking-tight">
        Update your item
      </h1>
      <form 
        className="space-y-4 md:space-y-6" 
      >
        <div className='w-3/4'>
         <div className='mb-4 dark:text-white'>Collection:</div>
          <label 
            className='mb-6 dark:text-white'
          >
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 w-full text-gray-900 dark:bg-gray-600 dark:text-white" 
              onChange={(e) => setSelectedCollection(e.target.value)}
              defaultValue={collection}
              required
            >
              {collection.map((collection) => (
                <option key={collection._id} value={collection._id}>
                  {collection.title}
                </option>
              ))}
            </select>
          </label>      
        </div>
        <div className='relative w-[170px] h-[170px] overflow-hidden mb-[1rem] rounded-sm'>
                {/* Display profile picture mosta9bel*/}
                
                {(itemPicture) ? (
                    <img src={itemPicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="flex justify-center items-center w-full h-full bg-[#ddd] text-gray-500 text-[1rem] font-bold ">Default Pic</div>
                )}
                {/* Input field to upload profile picture */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleItemPictureChange}
                    className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                  
                />
            </div>
        <div className='w-3/4'>
          <label 
            htmlFor="title" 
            className="flex justify-start mb-2 text-sm font-medium dark:text-white"
          >
            Title
          </label>
          <input 
            type="text" 
            name="title"
            id="title"
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-600 dark:border-gray-500 dark:text-white sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            required 
          />
        </div>
        <div className='w-3/4'>
          <label 
            htmlFor="author" 
            className="flex justify-start mb-2 text-sm font-medium dark:text-white"
          >
            {itemType === 'livre' ? 'Author' : (itemType === 'musique' ? 'Artist' : 'Director')}
          </label>
          <input 
            type="text" 
            name="author" 
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)} 
            className="bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-600 dark:border-gray-500 dark:text-white sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
            required 
          />
        </div>
        <div className='w-3/4'>
          <label 
            htmlFor="description" 
            className="flex justify-start mb-2 text-sm font-medium dark:text-white "
          >
            Description
          </label>
          <textarea 
            name="description" 
            id="description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)} 
            className="bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-600 dark:border-gray-500 dark:text-white sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-28"  
            required
          ></textarea>
        </div>

        {itemType === 'livre' ? ( 
          <>
            <div className='w-3/4'>
              <label 
                htmlFor="edition" 
                className="flex justify-start mb-2 text-sm font-medium dark:text-white"
              >
                Edition
              </label>
              <input 
                type="text" 
                name="edition" 
                id="edition" 
                value={edition}
                onChange={(e) => setEdition(e.target.value)} 
                className="bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-600 dark:border-gray-500 dark:text-white sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                required 
              />
            </div>
            <div className='w-3/4'>
              <label 
                htmlFor="publicationDate" 
                className="flex justify-start mb-2 text-sm font-medium dark:text-white"
              >
                Publication Date
              </label>
              <input 
                type="date" 
                name="publicationDate" 
                id="publicationDate" 
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)} 
                className="bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-600 dark:border-gray-500 dark:text-white sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
               
              />
            </div>
              <div className="w-3/4">
                <label 
                  htmlFor="isbn10" 
                  className="flex justify-start mb-2 text-sm font-medium dark:text-white"
                >
                  ISBN
                </label>
                <input 
                  type="text" 
                  name="isbn10" 
                  id="isbn10" 
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)} 
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-600 dark:border-gray-500 dark:text-white sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                  required 
                />
              </div>
            <div className="w-3/4 flex space-x-4">
              <div className="w-1/2">
                <label 
                  htmlFor="pages" 
                  className="flex justify-start mb-2 text-sm font-medium dark:text-white"
                >
                  Pages
                </label>
                <input 
                  type="number" 
                  name="pages" 
                  id="pages" 
                  value={pages}
                  onChange={(e) => setPages(e.target.value)} 
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-600 dark:border-gray-500 dark:text-white sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                  required 
                />
              </div>
              <div className="w-1/2">
                <label 
                  htmlFor="price" 
                  className="flex justify-start mb-2 text-sm font-medium dark:text-white"
                >
                  Price
                </label>
                <input 
                  type="number" 
                  name="price" 
                  id="price" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)} 
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-600 dark:border-gray-500 dark:text-white sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                  required 
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='w-3/4'>
              <label 
                htmlFor="publicationDate" 
                className="flex justify-start mb-2 text-sm font-medium dark:text-white"
              >
                Publication Date
              </label>
              <input 
                type="date" 
                name="publicationDate" 
                id="publicationDate" 
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)} 
                className="bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-600 dark:border-gray-500 dark:text-white sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                required 
              />
            </div>
            <div className="w-3/4 flex space-x-4">
              <div className="w-1/2">
                <label 
                  htmlFor="pages" 
                  className="flex justify-start mb-2 text-sm font-medium dark:text-white"
                >
                  Duration in minutes
                </label>
                <input 
                  type="number" 
                  name="pages" 
                  id="pages" 
                  value={duree}
                  onChange={(e) => setDuree(e.target.value)} 
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-600 dark:border-gray-500 dark:text-white sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                  required 
                />
              </div>
              <div className="w-1/2">
                <label 
                  htmlFor="price" 
                  className="flex justify-start mb-2 text-sm font-medium dark:text-white"
                >
                  Price
                </label>
                <input 
                  type="number" 
                  name="price" 
                  id="price"
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-600 dark:border-gray-500 dark:text-white sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                  required 
                />
              </div>
            </div>
          </>
        )
        }


        
        <button 
          type="submit" 
          className="w-1/2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          onClick={handleSubmit}
        >
          Update Item
        </button>
      </form>
    </div>
  );
};

export default UpdateItemPage;