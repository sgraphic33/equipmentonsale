import React, { useState, useEffect, useRef } from 'react';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp, setDoc, deleteField } from 'firebase/firestore';
import { Trash2, Edit2, Plus, LogOut, CheckCircle, XCircle, UploadCloud, X, Copy } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Helmet } from 'react-helmet-async';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    inventoryId: '',
    category: 'Printing',
    make: '',
    model: '',
    year: '',
    sn: '',
    description: '',
    note: '',
    location: '',
    price: '',
    quantity: '1',
    condition: 'Excellent',
    photos: [] as string[],
    video: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let unsubscribe = () => {};
    if (user) {
      const path = 'inventory';
      unsubscribe = onSnapshot(collection(db, path), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(data);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      });
    }
    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Failed to log in: ${errorMessage}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      inventoryId: '',
      category: 'Printing',
      make: '',
      model: '',
      year: '',
      sn: '',
      description: '',
      note: '',
      location: '',
      price: '',
      quantity: '1',
      condition: 'Excellent',
      photos: [],
      video: '',
      status: 'Available',
      isHidden: false
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (item: any) => {
    setFormData({
      inventoryId: item.inventoryId || '',
      category: item.category || 'Printing',
      make: item.make || '',
      model: item.model || '',
      year: item.year?.toString() || '',
      sn: item.sn || '',
      description: item.description || '',
      note: item.note || '',
      location: item.location || '',
      price: item.price?.toString() || '',
      quantity: item.quantity?.toString() || '1',
      condition: item.condition || 'Excellent',
      photos: item.photos || [],
      video: item.video || '',
      status: item.status || 'Available',
      isHidden: item.isHidden || false
    });
    setEditingId(item.id);
    setIsEditing(true);
  };

  const handleDuplicate = async (item: any) => {
    try {
      if (!window.confirm('Are you sure you want to duplicate this item?')) return;
      const now = Date.now();
      const newInventoryId = generateInventoryId(item.category || 'Printing', items);
      const payload: any = { ...item };
      delete payload.id;
      payload.inventoryId = newInventoryId;
      payload.createdAt = now;
      payload.updatedAt = now;
      
      const newId = uuidv4();
      await setDoc(doc(db, 'inventory', newId), payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'inventory');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteDoc(doc(db, 'inventory', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `inventory/${id}`);
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files) as File[];
    if (!files.length) return;
    processFiles(files);
  };

  const processFiles = async (files: File[]) => {
    try {
      const compressedPhotos = await Promise.all(
        files.filter(file => file.type.startsWith('image/')).map(compressImage)
      );
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...compressedPhotos].slice(0, 20) // Limit to 20 photos
      }));
    } catch (error) {
      console.error("Error compressing images:", error);
      alert("Failed to process one or more images.");
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!e.dataTransfer.files) return;
    const files = Array.from(e.dataTransfer.files) as File[];
    processFiles(files);
  };

  const generateInventoryId = (category: string, currentItems: any[]) => {
    const categoryInitial = category.substring(0, 3).toUpperCase();
    const prefix = `EOS-${categoryInitial}-`;
    
    let maxNum = 0;
    for (const item of currentItems) {
      if (item.inventoryId && item.inventoryId.startsWith(prefix)) {
        const numStr = item.inventoryId.substring(prefix.length);
        const num = parseInt(numStr, 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
    
    const nextNum = maxNum + 1;
    const numPadded = String(nextNum).padStart(5, '0');
    return `${prefix}${numPadded}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const now = Date.now();
      const payload: any = {
        inventoryId: formData.inventoryId || generateInventoryId(formData.category, items),
        category: formData.category,
        make: formData.make,
        model: formData.model,
        price: Number(formData.price) || 0,
        quantity: Number(formData.quantity) || 1,
        status: formData.status || 'Available',
        isHidden: formData.isHidden || false,
        updatedAt: now
      };
      
      if (isEditing) {
        payload.year = formData.year ? Number(formData.year) : deleteField();
        payload.sn = formData.sn ? formData.sn : deleteField();
        payload.description = formData.description ? formData.description : deleteField();
        payload.note = formData.note ? formData.note : deleteField();
        payload.location = formData.location ? formData.location : deleteField();
        payload.condition = formData.condition ? formData.condition : deleteField();
        payload.video = formData.video ? formData.video : deleteField();
        payload.photos = formData.photos && formData.photos.length > 0 ? formData.photos : deleteField();
      } else {
        if (formData.year) payload.year = Number(formData.year);
        if (formData.sn) payload.sn = formData.sn;
        if (formData.description) payload.description = formData.description;
        if (formData.note) payload.note = formData.note;
        if (formData.location) payload.location = formData.location;
        if (formData.condition) payload.condition = formData.condition;
        if (formData.video) payload.video = formData.video;
        if (formData.photos && formData.photos.length > 0) payload.photos = formData.photos;
      }

      const id = editingId || uuidv4();
      
      if (isEditing) {
        const itemRef = doc(db, 'inventory', id);
        await updateDoc(itemRef, payload);
      } else {
        payload.createdAt = now;
        await setDoc(doc(db, 'inventory', id), payload);
      }
      resetForm();
    } catch (error) {
      console.error(error);
      handleFirestoreError(error, OperationType.WRITE, 'inventory');
      alert(`Error saving: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-md shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Panel</h1>
          <p className="text-gray-600 mb-6">Please log in to manage inventory.</p>
          <button
            onClick={handleLogin}
            className="w-full bg-[#B73D73] text-white font-bold py-3 px-4 rounded-sm hover:bg-[#9E3261] transition-colors"
          >
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50">
      <Helmet>
        <title>Admin Dashboard | Equipment on Sale</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Inventory Management</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">{user.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center text-red-600 hover:text-red-800 font-bold"
            >
              <LogOut className="w-5 h-5 mr-1" /> Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200 sticky top-28">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                {isEditing ? <><Edit2 className="w-5 h-5 mr-2 text-[#B73D73]" /> Edit Item</> : <><Plus className="w-5 h-5 mr-2 text-[#B73D73]" /> Add New Item</>}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Inventory ID / SKU</label>
                  <input type="text" name="inventoryId" value={formData.inventoryId} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-sm p-2 focus:ring-[#B73D73] focus:border-[#B73D73]" placeholder="Leave blank to auto-generate (e.g., EOS-PRI-00001)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category *</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-sm p-2 focus:ring-[#B73D73] focus:border-[#B73D73]">
                    <option value="Printing">Printing</option>
                    <option value="Medical">Medical</option>
                    <option value="Metal Work">Metal Work</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Construction">Construction</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Make *</label>
                    <input type="text" name="make" value={formData.make} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-sm p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Model *</label>
                    <input type="text" name="model" value={formData.model} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-sm p-2" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Year</label>
                    <input type="number" name="year" value={formData.year} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-sm p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Serial No. (SN)</label>
                    <input type="text" name="sn" value={formData.sn} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-sm p-2" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price ($) *</label>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-sm p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity *</label>
                    <input type="number" name="quantity" min="1" value={formData.quantity} onChange={handleInputChange} required className="mt-1 block w-full border border-gray-300 rounded-sm p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Condition</label>
                    <input type="text" name="condition" value={formData.condition} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-sm p-2" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-sm p-2 bg-white">
                      <option value="Available">Available</option>
                      <option value="Pending Sale">Pending Sale</option>
                      <option value="Sold">Sold</option>
                    </select>
                  </div>
                  <div className="flex items-center mt-6">
                    <input 
                      type="checkbox" 
                      name="isHidden" 
                      id="isHidden"
                      checked={formData.isHidden} 
                      onChange={(e) => setFormData({ ...formData, isHidden: e.target.checked })} 
                      className="h-4 w-4 text-[#B73D73] focus:ring-[#B73D73] border-gray-300 rounded" 
                    />
                    <label htmlFor="isHidden" className="ml-2 block text-sm text-gray-900 font-medium">
                      Hide from public inventory
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-sm p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-sm p-2"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes (Internal/Extra)</label>
                  <textarea name="note" value={formData.note} onChange={handleInputChange} rows={2} className="mt-1 block w-full border border-gray-300 rounded-sm p-2"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
                  <div 
                    className={`border-2 border-dashed rounded-sm p-6 text-center cursor-pointer transition-colors ${isDragging ? 'border-[#B73D73] bg-[#B73D73]/5' : 'border-gray-300 hover:border-[#B73D73]'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Drag and drop images here, or click to select</p>
                    <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG (Max 20 images)</p>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </div>
                  
                  {formData.photos.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="relative group rounded-sm overflow-hidden border border-gray-200">
                          <img src={photo} alt={`Upload ${index}`} className="w-full h-24 object-cover" />
                          <button 
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Video URL</label>
                  <input type="text" name="video" value={formData.video} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-sm p-2" />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-[#B73D73] text-white font-bold py-2 px-4 rounded-sm hover:bg-[#9E3261] transition-colors shadow-md">
                    {isEditing ? 'Update Item' : 'Add Item'}
                  </button>
                  {isEditing && (
                    <button type="button" onClick={resetForm} className="flex-1 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-sm hover:bg-gray-300 transition-colors">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price details</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id} className={`hover:bg-gray-50 ${item.isHidden ? 'opacity-60' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {item.make} {item.model}
                          {item.isHidden && <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">Hidden</span>}
                        </div>
                        <div className="text-sm text-gray-500">ID: {item.inventoryId} | Year: {item.year || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>${item.price?.toLocaleString()}</div>
                        <div className="text-gray-500 text-xs mt-1">Qty: {item.quantity || 1}</div>
                        <div className={`text-xs mt-1 ${item.status === 'Sold' ? 'text-red-600 font-bold' : item.status === 'Pending Sale' ? 'text-orange-500 font-bold' : 'text-green-600'}`}>{item.status || 'Available'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleDuplicate(item)} className="text-gray-500 hover:text-gray-700 mr-4" title="Duplicate Item">
                          <Copy className="w-5 h-5 inline" />
                        </button>
                        <button onClick={() => handleEdit(item)} className="text-[#B73D73] hover:text-[#9E3261] mr-4" title="Edit Item">
                          <Edit2 className="w-5 h-5 inline" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-600" title="Delete Item">
                          <Trash2 className="w-5 h-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        No inventory items found. Add one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
