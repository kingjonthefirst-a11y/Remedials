import React, { forwardRef } from 'react';
import { FormState } from '../types';

interface FormPreviewProps {
  data: FormState;
}

// We use forwardRef to allow the parent to capture this DOM element for PDF generation
export const FormPreview = forwardRef<HTMLDivElement, FormPreviewProps>(({ data }, ref) => {
  
  const InputDisplay = ({ value, label }: { value: string, label?: string }) => (
    <div className="flex flex-col h-full justify-center">
      <div className="font-mono text-sm md:text-base text-gray-800 px-2 break-words whitespace-pre-wrap">
        {value}
      </div>
    </div>
  );

  return (
    <div ref={ref} className="bg-gray-100 p-4 print:p-0">
      {/* PAGE 1 */}
      <div className="a4-page mb-8 print:mb-0" id="page-1">
        {/* Header */}
        <div className="bg-bookerBlue text-white p-4 flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold tracking-tight bg-orange-500 text-white px-2 inline-block w-fit">BOOKER</h1>
            <span className="text-xs tracking-widest uppercase ml-1">Wholesale</span>
            <h2 className="text-4xl font-black text-yellow-400 mt-1 lowercase tracking-tighter">makro</h2>
          </div>
          <div className="text-center flex-grow">
            <h1 className="text-4xl font-normal">EICR Rectification Form</h1>
          </div>
        </div>

        {/* Form Body - Using Grid for alignment */}
        <div className="space-y-4 text-sm font-bold text-bookerBlue">
          
          {/* EDN Number */}
          <div className="flex items-center">
            <label className="w-64 text-right pr-4">EDN Number :</label>
            <div className="flex-grow border-2 border-black h-10 bg-white">
              <InputDisplay value={data.ednNumber} />
            </div>
          </div>

          {/* Store Number and Name */}
          <div className="flex items-center">
            <label className="w-64 text-right pr-4">Store Number and Name:</label>
            <div className="flex-grow border-2 border-black h-10 bg-white">
              <InputDisplay value={data.storeNumberName} />
            </div>
          </div>

          {/* DB ID & Circuit Ref */}
          <div className="flex items-start pt-1">
            <label className="w-64 text-right pr-4 leading-tight">DB Identification Number & Circuit<br/>Reference:</label>
            <div className="flex-grow border-2 border-black h-12 bg-white">
              <InputDisplay value={data.dbId} />
            </div>
          </div>

          {/* Description */}
          <div className="flex items-start pt-1">
            <label className="w-64 text-right pr-4">Description of Work Undertaken:</label>
            <div className="flex-grow border-2 border-black h-24 bg-white">
              <InputDisplay value={data.description} />
            </div>
          </div>

          {/* Spacer */}
          <div className="h-4"></div>

          {/* Protective Device */}
          <div className="flex items-center">
            <label className="w-64 text-right pr-4">Protective Device:</label>
            <div className="flex items-center space-x-2 flex-grow">
              <span className="text-bookerBlue">BS EN:</span>
              <div className="border-2 border-black h-8 w-24 bg-white"><InputDisplay value={data.bsEn} /></div>
              
              <span className="text-bookerBlue ml-4">Type:</span>
              <div className="border-2 border-black h-8 w-24 bg-white"><InputDisplay value={data.type} /></div>

              <span className="text-bookerBlue ml-4">Rating:</span>
              <div className="border-2 border-black h-8 w-24 bg-white"><InputDisplay value={data.rating} /></div>
            </div>
          </div>

          {/* Conductor */}
          <div className="flex items-center">
            <label className="w-64 text-right pr-4">Conductor:</label>
            <div className="flex items-center space-x-2 flex-grow">
              <span className="text-bookerBlue">CSA of Live Conductors:</span>
              <div className="border-2 border-black h-8 w-24 bg-white"><InputDisplay value={data.csaLive} /></div>
              
              <span className="text-bookerBlue ml-4">CSA of CPC:</span>
              <div className="border-2 border-black h-8 w-24 bg-white"><InputDisplay value={data.csaCpc} /></div>
            </div>
          </div>

          {/* Test Results */}
          <div className="flex items-center">
            <label className="w-64 text-right pr-4">Test Results:</label>
            <div className="flex items-center space-x-2 flex-grow flex-wrap gap-y-2">
              <span className="text-bookerBlue">Ze / ZDb:</span>
              <div className="border-2 border-black h-8 w-24 bg-white flex items-center justify-between px-1">
                 <span className="truncate w-full">{data.ze}</span>
                 <span className="text-xs">Ω</span>
              </div>
              
              <span className="text-bookerBlue ml-2">Zs:</span>
              <div className="border-2 border-black h-8 w-24 bg-white flex items-center justify-between px-1">
                 <span className="truncate w-full">{data.zs}</span>
                 <span className="text-xs">Ω</span>
              </div>

              <span className="text-bookerBlue ml-2">R1+R2:</span>
              <div className="border-2 border-black h-8 w-24 bg-white flex items-center justify-between px-1">
                 <span className="truncate w-full">{data.r1r2}</span>
                 <span className="text-xs">Ω</span>
              </div>
            </div>
          </div>
          
           {/* RCD Row (Aligned under Test Results area visually) */}
           <div className="flex items-center">
            <div className="w-64 pr-4"></div> 
            <div className="flex items-center space-x-2 flex-grow justify-end pr-10">
               <span className="text-bookerBlue">RCD x1:</span>
               <div className="border-2 border-black h-8 w-32 bg-white flex items-center justify-between px-1">
                 <span className="truncate w-full">{data.rcd}</span>
                 <span className="text-xs">mS</span>
              </div>
            </div>
          </div>

          {/* Date Work Completed */}
          <div className="flex items-center mt-6">
            <label className="w-64 text-right pr-4">Date Work Completed:</label>
            <div className="border-2 border-black h-8 w-48 bg-white"><InputDisplay value={data.dateCompleted} /></div>
          </div>

          {/* WON */}
          <div className="flex items-center">
            <label className="w-64 text-right pr-4">WON for Completed Work:</label>
            <div className="border-2 border-black h-8 w-48 bg-white"><InputDisplay value={data.won} /></div>
          </div>

           {/* Signatures */}
           <div className="flex items-center mt-8 pt-4">
            <label className="w-64 text-right pr-4">Name of Technician:</label>
            <div className="border-2 border-black h-8 w-64 bg-white"><InputDisplay value={data.technicianName} /></div>
            
            <label className="w-48 text-right pr-4">Supervisor Verification:</label>
            <div className="border-2 border-black h-8 w-64 bg-white"><InputDisplay value={data.supervisorName} /></div>
          </div>

        </div>

        {/* Footer */}
        <div className="absolute bottom-10 left-0 w-full px-10">
          <div className="bg-bookerBlue text-white py-4 px-6 flex justify-between items-center">
            <span className="text-xl font-light">Everyone, every day, home safely<span className="text-red-500 font-bold">.</span></span>
            <div className="text-right">
              <h3 className="text-2xl font-bold text-gray-400">Safety First</h3>
              <p className="text-sm">be the <span className="text-yellow-400 font-bold">difference</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 2 - IMAGES */}
      <div className="a4-page relative" id="page-2">
         <div className="grid grid-cols-2 gap-8 h-full">
            <div className="flex flex-col h-full">
                <h3 className="text-bookerBlue font-bold mb-2 uppercase">Image 1</h3>
                <div className="border-2 border-gray-300 flex-grow flex items-center justify-center bg-white overflow-hidden">
                    {data.image1 ? (
                        <img src={data.image1} alt="Evidence 1" className="max-w-full max-h-full object-contain" />
                    ) : (
                        <span className="text-gray-300">No Image Selected</span>
                    )}
                </div>
            </div>
            <div className="flex flex-col h-full">
                <h3 className="text-bookerBlue font-bold mb-2 uppercase">Image 2</h3>
                <div className="border-2 border-gray-300 flex-grow flex items-center justify-center bg-white overflow-hidden">
                    {data.image2 ? (
                        <img src={data.image2} alt="Evidence 2" className="max-w-full max-h-full object-contain" />
                    ) : (
                        <span className="text-gray-300">No Image Selected</span>
                    )}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
});

FormPreview.displayName = "FormPreview";