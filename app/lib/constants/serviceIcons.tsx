import React from 'react';
import { 
  FaBalanceScale, 
  FaGavel, 
  FaFileContract, 
  FaUserTie, 
  FaBriefcase,
  FaHome,
  FaBuilding,
  FaHandshake,
  FaUsers,
  FaShieldAlt,
  FaFileAlt,
  FaUniversity,
  FaUserShield,
  FaScroll,
  FaCertificate,
  FaBook,
  FaPeopleArrows,
  FaLandmark,
  FaStamp,
  FaClipboardCheck,
  FaFileSignature,
  FaUsersCog,
  FaBusinessTime,
  FaChartLine
} from 'react-icons/fa';
import { 
  MdFamilyRestroom, 
  MdBusinessCenter, 
  MdGavel,
  MdPolicy,
  MdAccountBalance,
  MdWork,
  MdDescription,
  MdVerifiedUser,
  MdAssignment,
  MdBusiness
} from 'react-icons/md';
import { 
  HiOfficeBuilding,
  HiScale,
  HiDocumentText,
  HiUserGroup,
  HiClipboardList
} from 'react-icons/hi';
import { BiSolidBank, BiSolidBusiness } from 'react-icons/bi';
import { BsFillHouseFill, BsPeopleFill, BsFileEarmarkTextFill } from 'react-icons/bs';
import { IoDocumentTextSharp, IoBusiness } from 'react-icons/io5';
import { RiGovernmentFill, RiAuctionFill } from 'react-icons/ri';

export interface ServiceIcon {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
}

export const serviceIcons: ServiceIcon[] = [
  // Legal & Justice Icons
  { id: 'balance-scale', name: 'Balanza de Justicia', icon: <FaBalanceScale className="w-6 h-6 text-current" />, category: 'Legal' },
  { id: 'gavel', name: 'Mazo de Juez', icon: <FaGavel className="w-6 h-6 text-current" />, category: 'Legal' },
  { id: 'md-gavel', name: 'Mazo Material', icon: <MdGavel className="w-6 h-6 text-current" />, category: 'Legal' },
  { id: 'scale', name: 'Escala de Justicia', icon: <HiScale className="w-6 h-6 text-current" />, category: 'Legal' },
  { id: 'shield', name: 'Escudo Legal', icon: <FaShieldAlt className="w-6 h-6 text-current" />, category: 'Legal' },
  { id: 'user-shield', name: 'Usuario Protegido', icon: <FaUserShield className="w-6 h-6 text-current" />, category: 'Legal' },
  { id: 'landmark', name: 'Edificio Judicial', icon: <FaLandmark className="w-6 h-6 text-current" />, category: 'Legal' },
  
  // Document Icons
  { id: 'file-contract', name: 'Contrato', icon: <FaFileContract className="w-6 h-6 text-current" />, category: 'Documentos' },
  { id: 'file-alt', name: 'Documento', icon: <FaFileAlt className="w-6 h-6 text-current" />, category: 'Documentos' },
  { id: 'scroll', name: 'Pergamino', icon: <FaScroll className="w-6 h-6 text-current" />, category: 'Documentos' },
  { id: 'certificate', name: 'Certificado', icon: <FaCertificate className="w-6 h-6 text-current" />, category: 'Documentos' },
  { id: 'file-signature', name: 'Firma de Documento', icon: <FaFileSignature className="w-6 h-6 text-current" />, category: 'Documentos' },
  { id: 'document-text', name: 'Texto de Documento', icon: <HiDocumentText className="w-6 h-6 text-current" />, category: 'Documentos' },
  { id: 'clipboard-check', name: 'Lista Verificada', icon: <FaClipboardCheck className="w-6 h-6 text-current" />, category: 'Documentos' },
  { id: 'clipboard-list', name: 'Lista de Tareas', icon: <HiClipboardList className="w-6 h-6 text-current" />, category: 'Documentos' },
  { id: 'description', name: 'Descripción', icon: <MdDescription className="w-6 h-6 text-current" />, category: 'Documentos' },
  { id: 'assignment', name: 'Asignación', icon: <MdAssignment className="w-6 h-6 text-current" />, category: 'Documentos' },
  { id: 'document-sharp', name: 'Documento Sharp', icon: <IoDocumentTextSharp className="w-6 h-6 text-current" />, category: 'Documentos' },
  { id: 'file-text', name: 'Archivo de Texto', icon: <BsFileEarmarkTextFill className="w-6 h-6 text-current" />, category: 'Documentos' },
  { id: 'stamp', name: 'Sello', icon: <FaStamp className="w-6 h-6 text-current" />, category: 'Documentos' },
  
  // Business Icons
  { id: 'briefcase', name: 'Maletín', icon: <FaBriefcase className="w-6 h-6 text-current" />, category: 'Negocios' },
  { id: 'building', name: 'Edificio', icon: <FaBuilding className="w-6 h-6 text-current" />, category: 'Negocios' },
  { id: 'office-building', name: 'Edificio de Oficinas', icon: <HiOfficeBuilding className="w-6 h-6 text-current" />, category: 'Negocios' },
  { id: 'business-center', name: 'Centro de Negocios', icon: <MdBusinessCenter className="w-6 h-6 text-current" />, category: 'Negocios' },
  { id: 'business-time', name: 'Tiempo de Negocios', icon: <FaBusinessTime className="w-6 h-6 text-current" />, category: 'Negocios' },
  { id: 'chart-line', name: 'Gráfico de Líneas', icon: <FaChartLine className="w-6 h-6 text-current" />, category: 'Negocios' },
  { id: 'work', name: 'Trabajo', icon: <MdWork className="w-6 h-6 text-current" />, category: 'Negocios' },
  { id: 'md-business', name: 'Negocio Material', icon: <MdBusiness className="w-6 h-6 text-current" />, category: 'Negocios' },
  { id: 'io-business', name: 'Negocio IO', icon: <IoBusiness className="w-6 h-6 text-current" />, category: 'Negocios' },
  { id: 'bi-business', name: 'Negocio BI', icon: <BiSolidBusiness className="w-6 h-6 text-current" />, category: 'Negocios' },
  
  // People & Family Icons
  { id: 'user-tie', name: 'Usuario Formal', icon: <FaUserTie className="w-6 h-6 text-current" />, category: 'Personas' },
  { id: 'users', name: 'Usuarios', icon: <FaUsers className="w-6 h-6 text-current" />, category: 'Personas' },
  { id: 'family-restroom', name: 'Familia', icon: <MdFamilyRestroom className="w-6 h-6 text-current" />, category: 'Personas' },
  { id: 'handshake', name: 'Apretón de Manos', icon: <FaHandshake className="w-6 h-6 text-current" />, category: 'Personas' },
  { id: 'people-arrows', name: 'Personas con Flechas', icon: <FaPeopleArrows className="w-6 h-6 text-current" />, category: 'Personas' },
  { id: 'user-group', name: 'Grupo de Usuarios', icon: <HiUserGroup className="w-6 h-6 text-current" />, category: 'Personas' },
  { id: 'users-cog', name: 'Configuración de Usuarios', icon: <FaUsersCog className="w-6 h-6 text-current" />, category: 'Personas' },
  { id: 'people-fill', name: 'Personas Llenas', icon: <BsPeopleFill className="w-6 h-6 text-current" />, category: 'Personas' },
  
  // Property & Government Icons
  { id: 'home', name: 'Casa', icon: <FaHome className="w-6 h-6 text-current" />, category: 'Propiedad' },
  { id: 'house-fill', name: 'Casa Llena', icon: <BsFillHouseFill className="w-6 h-6 text-current" />, category: 'Propiedad' },
  { id: 'university', name: 'Universidad', icon: <FaUniversity className="w-6 h-6 text-current" />, category: 'Gobierno' },
  { id: 'bank', name: 'Banco', icon: <BiSolidBank className="w-6 h-6 text-current" />, category: 'Gobierno' },
  { id: 'government', name: 'Gobierno', icon: <RiGovernmentFill className="w-6 h-6 text-current" />, category: 'Gobierno' },
  { id: 'account-balance', name: 'Balance de Cuenta', icon: <MdAccountBalance className="w-6 h-6 text-current" />, category: 'Gobierno' },
  { id: 'auction', name: 'Subasta', icon: <RiAuctionFill className="w-6 h-6 text-current" />, category: 'Gobierno' },
  { id: 'policy', name: 'Política', icon: <MdPolicy className="w-6 h-6 text-current" />, category: 'Gobierno' },
  { id: 'verified-user', name: 'Usuario Verificado', icon: <MdVerifiedUser className="w-6 h-6 text-current" />, category: 'Gobierno' },
  { id: 'book', name: 'Libro', icon: <FaBook className="w-6 h-6 text-current" />, category: 'Educación' },
];

export const getIconById = (id: string): React.ReactNode => {
  const iconData = serviceIcons.find(icon => icon.id === id);
  if (iconData) {
    // Return the icon with larger size for display
    const originalIcon = iconData.icon as React.ReactElement;
    return React.cloneElement(originalIcon, {
      className: "w-12 h-12 text-white"
    });
  }
  // Default icon if not found
  return <FaBalanceScale className="w-12 h-12 text-white" />;
};

export const getIconForPreview = (id: string): React.ReactNode => {
  const iconData = serviceIcons.find(icon => icon.id === id);
  if (iconData) {
    const originalIcon = iconData.icon as React.ReactElement;
    return React.cloneElement(originalIcon, {
      className: "w-6 h-6 text-current"
    });
  }
  return <FaBalanceScale className="w-6 h-6 text-current" />;
};