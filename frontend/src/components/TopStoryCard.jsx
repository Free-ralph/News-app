import React from 'react'

const TopStoryCard = ({title, author, createdAt, category}) => {
  const datePosted = new Date(createdAt).getDate();
  const currentDate = new Date().getDate();
  const daysPassed =  currentDate - datePosted
  const dateMap = {
    0 : 'today', 
    1 : 'yesterday'
  }
  const colors = {
    story : 'bg-purple-400',
    poll : 'bg-orange-400',
    job : 'bg-lime-400'
  }
  return (
    <div className='text-secondary p-3 w-[15rem] snap-center snap-mandatory'>
        <p className={`text-sm ${colors[category]} text-white px-2 inline-block`}>{category}</p>
        <p className='font-semibold text-center'>
            {title}
        </p>
        <div className='text-sm text-center'>
          <p>posted By: {author}</p>
          <p>posted: {(daysPassed in dateMap) ? `${dateMap[daysPassed]}` : `${daysPassed} days ago`}</p>
        </div>
    </div>
  )
}

export default TopStoryCard