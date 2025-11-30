import React, { useState, useRef, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Upload, Search, FileDown, Image as ImageIcon, FileText, ChevronDown, Lock } from 'lucide-react';
import { CSVRow, FormState, INITIAL_FORM_STATE } from './types';
import { mapRowToForm } from './utils/parser';
import { FormPreview } from './components/FormPreview';

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);

  // App State
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [selectedWo, setSelectedWo] = useState<string>("");
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Parse CSV Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setCsvData(results.data as CSVRow[]);
        },
      });
    }
  };

  // Autocomplete/Search Logic
  const filteredWOs = useMemo(() => {
    if (csvData.length === 0) return [];
    
    // If no search term, return all (capped for safety)
    if (!selectedWo) return csvData.slice(0, 2000);

    return csvData
      .filter(row => row["WO #"]?.toLowerCase().includes(selectedWo.toLowerCase()))
      .slice(0, 2000);
  }, [selectedWo, csvData]);

  const selectRow = (row: CSVRow) => {
    setSelectedWo(row["WO #"] || "");
    const mapped = mapRowToForm(row);
    setFormData(prev => ({ ...prev, ...mapped }));
    setIsDropdownOpen(false);
  };

  // Form Input Handler
  const handleInputChange = (field: keyof FormState, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Image Upload Handler
  const handleImageUpload = (field: 'image1' | 'image2', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // PDF Generation
  const generatePDF = async () => {
    if (!printRef.current) return;
    setIsGenerating(true);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Select the two pages specifically
      const page1 = printRef.current.querySelector('#page-1') as HTMLElement;
      const page2 = printRef.current.querySelector('#page-2') as HTMLElement;

      if (page1) {
        const canvas1 = await html2canvas(page1, { scale: 2, useCORS: true });
        const imgData1 = canvas1.toDataURL('image/png');
        pdf.addImage(imgData1, 'PNG', 0, 0, 210, 297);
      }

      if (page2) {
        pdf.addPage();
        const canvas2 = await html2canvas(page2, { scale: 2, useCORS: true });
        const imgData2 = canvas2.toDataURL('image/png');
        pdf.addImage(imgData2, 'PNG', 0, 0, 210, 297);
      }

      pdf.save(`EICR_Form_${formData.won || 'Untitled'}.pdf`);
    } catch (err) {
      console.error("PDF Generation failed", err);
      alert("Failed to generate PDF. See console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "bksouth") {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm border-t-4 border-bookerBlue">
           <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                  <div className="bg-bookerBlue p-3 rounded-full">
                      <Lock className="w-8 h-8 text-white" />
                  </div>
              </div>
              <h1 className="text-2xl font-bold text-bookerBlue">Restricted Access</h1>
              <p className="text-gray-500 text-sm mt-2">Please enter the password to access the EICR Tool.</p>
           </div>
  
           <form onSubmit={handleLogin} className="space-y-4">
              <div>
                 <input 
                   type="password" 
                   className={`w-full p-3 border rounded-lg focus:ring-2 outline-none transition-all ${loginError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-bookerBlue focus:border-bookerBlue'}`}
                   placeholder="Enter Password"
                   value={passwordInput}
                   onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setLoginError(false);
                   }}
                   autoFocus
                 />
                 {loginError && <p className="text-red-500 text-xs mt-1 ml-1">Incorrect password. Please try again.</p>}
              </div>
              
              <button 
                type="submit"
                className="w-full bg-bookerBlue text-white font-bold py-3 rounded-lg hover:bg-blue-900 transition-colors shadow-md hover:shadow-lg transform active:scale-95 duration-200"
              >
                 Login
              </button>
           </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-900">
      
      {/* SIDEBAR: Controls & Inputs */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 p-6 overflow-y-auto h-screen shadow-lg z-10">
        <h2 className="text-xl font-bold mb-6 text-bookerBlue flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Form Generator
        </h2>

        {/* 1. Upload CSV */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">1. Upload CSV Data</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-6 h-6 mb-2 text-gray-400" />
                <p className="text-xs text-gray-500">{csvData.length > 0 ? `${csvData.length} records loaded` : "Drag CSV here or click"}</p>
              </div>
              <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        {/* 2. Search WO */}
        <div className="mb-6 relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">2. Search Work Order</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-500" />
            </div>
            <input 
              type="text" 
              className="block w-full p-2 pl-10 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
              placeholder={csvData.length > 0 ? "Search or Select WO #..." : "Upload CSV first..."}
              value={selectedWo}
              onChange={(e) => {
                setSelectedWo(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onBlur={() => {
                // Delay hiding to allow click event on dropdown item to fire
                setTimeout(() => setIsDropdownOpen(false), 200);
              }}
              disabled={csvData.length === 0}
            />
            <div 
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              onClick={() => {
                 if (csvData.length > 0) {
                    setIsDropdownOpen(!isDropdownOpen);
                 }
              }}
            >
               <ChevronDown className="w-4 h-4 text-gray-500 hover:text-gray-700" />
            </div>
          </div>
          
          {/* Autocomplete Dropdown */}
          {isDropdownOpen && csvData.length > 0 && (
            <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
              {filteredWOs.length > 0 ? (
                filteredWOs.map((row, idx) => (
                  <div 
                    key={idx} 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-50 last:border-0"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent input blur
                      selectRow(row);
                    }}
                  >
                    <div className="font-bold text-bookerBlue">{row["WO #"]}</div>
                    <div className="text-xs text-gray-600 truncate">{row["Site Name"]}</div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">No matches found</div>
              )}
            </div>
          )}
        </div>

        <hr className="my-6" />

        {/* 3. Manual Edits */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">3. Edit Details</h3>
          
          <div>
            <label className="text-xs text-gray-500">EDN Number</label>
            <input className="w-full border p-1 rounded text-sm" value={formData.ednNumber} onChange={e => handleInputChange('ednNumber', e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-500">DB ID</label>
            <input className="w-full border p-1 rounded text-sm" value={formData.dbId} onChange={e => handleInputChange('dbId', e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-500">Description</label>
            <textarea className="w-full border p-1 rounded text-sm" rows={3} value={formData.description} onChange={e => handleInputChange('description', e.target.value)} />
          </div>

          {/* Technical Details */}
          <div className="grid grid-cols-3 gap-2">
             <div><label className="text-xs text-gray-500">BS EN</label><input className="w-full border p-1 text-sm" value={formData.bsEn} onChange={e => handleInputChange('bsEn', e.target.value)} /></div>
             <div><label className="text-xs text-gray-500">Type</label><input className="w-full border p-1 text-sm" value={formData.type} onChange={e => handleInputChange('type', e.target.value)} /></div>
             <div><label className="text-xs text-gray-500">Rating</label><input className="w-full border p-1 text-sm" value={formData.rating} onChange={e => handleInputChange('rating', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
             <div><label className="text-xs text-gray-500">CSA Live</label><input className="w-full border p-1 text-sm" value={formData.csaLive} onChange={e => handleInputChange('csaLive', e.target.value)} /></div>
             <div><label className="text-xs text-gray-500">CSA CPC</label><input className="w-full border p-1 text-sm" value={formData.csaCpc} onChange={e => handleInputChange('csaCpc', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
             <div><label className="text-xs text-gray-500">Ze/ZDb</label><input className="w-full border p-1 text-sm" value={formData.ze} onChange={e => handleInputChange('ze', e.target.value)} /></div>
             <div><label className="text-xs text-gray-500">Zs</label><input className="w-full border p-1 text-sm" value={formData.zs} onChange={e => handleInputChange('zs', e.target.value)} /></div>
             <div><label className="text-xs text-gray-500">R1+R2</label><input className="w-full border p-1 text-sm" value={formData.r1r2} onChange={e => handleInputChange('r1r2', e.target.value)} /></div>
             <div><label className="text-xs text-gray-500">RCD</label><input className="w-full border p-1 text-sm" value={formData.rcd} onChange={e => handleInputChange('rcd', e.target.value)} /></div>
          </div>

          <div>
             <label className="text-xs text-gray-500">Date Completed</label>
             <input type="date" className="w-full border p-1 text-sm" value={formData.dateCompleted} onChange={e => handleInputChange('dateCompleted', e.target.value)} />
          </div>

          <div>
            <label className="text-xs text-gray-500">Technician</label>
            <input className="w-full border p-1 rounded text-sm" value={formData.technicianName} onChange={e => handleInputChange('technicianName', e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-gray-500">Supervisor</label>
            <input className="w-full border p-1 rounded text-sm" value={formData.supervisorName} onChange={e => handleInputChange('supervisorName', e.target.value)} />
          </div>

          {/* Image Uploads */}
          <div className="border-t pt-4">
             <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Evidence Images</h4>
             <div className="grid grid-cols-2 gap-2">
               <div>
                  <label className="text-xs block mb-1">Image 1</label>
                  <input type="file" accept="image/*" className="text-xs w-full" onChange={(e) => handleImageUpload('image1', e)} />
               </div>
               <div>
                  <label className="text-xs block mb-1">Image 2</label>
                  <input type="file" accept="image/*" className="text-xs w-full" onChange={(e) => handleImageUpload('image2', e)} />
               </div>
             </div>
          </div>
        </div>
        
        <div className="mt-8 pb-8">
            <button 
                onClick={generatePDF}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 bg-bookerBlue text-white p-3 rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50"
            >
                {isGenerating ? 'Generating...' : <><FileDown className="w-5 h-5" /> Download PDF</>}
            </button>
        </div>
      </div>

      {/* PREVIEW AREA */}
      <div className="flex-grow bg-gray-200 overflow-auto flex justify-center p-8">
        <FormPreview ref={printRef} data={formData} />
      </div>
    </div>
  );
};

export default App;