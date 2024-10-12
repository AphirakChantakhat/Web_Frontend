import SideBar from '../../layout/Sidebar.js'
import Detail from './Detail.js'


const List = () => {
  return (
    <div className='user flex'>
        <div className="userContainer flex">
          <SideBar/>
          <Detail />
        </div>
    </div>
  )
}

export default List;