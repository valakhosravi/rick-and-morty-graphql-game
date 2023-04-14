import './Popup.scss'
import React from 'react'

export default function Popup({ children }) {
    return (
        <div className='rm-popup-container container'>
            <div className='rm-popup bg-white rounded p-5 shadow'>
                {children}
            </div>
        </div>

        // <div className='modal'>
        //     <div class="modal-dialog">
        //         <div class="modal-content">
        //             <div class="modal-header">
        //                 <h5 class="modal-title">Modal title</h5>
        //                 <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        //             </div>
        //             <div class="modal-body">
        //                 <p>Modal body text goes here.</p>
        //             </div>
        //             <div class="modal-footer">
        //                 <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        //                 <button type="button" class="btn btn-primary">Save changes</button>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    )
}
