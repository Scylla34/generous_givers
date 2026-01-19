"use client";

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Building2, Mail, Phone, Globe, MapPin, Calendar, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ISPProfile = () => {
  const router = useRouter();

  const isp = {
    ispCode: "JUB004",
    ispName: "Jubilee Insurance Company",
    ispLegalName: "Jubilee Insurance Company of Kenya Limited",
    ispType: "COMPOSITE",
    registrationNumber: "CPR/2024/007890",
    taxIdentificationNumber: "P052024789K",
    email: "info@jubileeinsurance.com",
    phonePrimary: "+254722789456",
    phoneSecondary: "+254733456789",
    website: "www.jubileeinsurance.com",
    physicalAddress: "Jubilee Insurance House, Wabera Street, Nairobi CBD",
    postalAddress: "P.O. Box 30376-00100, Nairobi",
    country: "Kenya",
    approvalStatus: "PENDING_APPROVAL",
    isActive: false,
  };

  const licenses = [
    { licenseNumber: "IRA/JUB/2024/GEN/003", type: "GENERAL", expiry: "2027-02-28", daysLeft: 452 },
    { licenseNumber: "IRA/JUB/2024/LIFE/002", type: "LIFE", expiry: "2027-01-31", daysLeft: 424 },
    { licenseNumber: "IRA/JUB/2024/COMP/001", type: "COMPOSITE", expiry: "2027-01-14", daysLeft: 407 },
  ];

  const handleEditClick = () => {
    router.push("/insuremaster/isps/edit?id=1b1d27ba-1e18-4197-b2b1-8561ffa62ae8");
  };

  return (
    <div className="space-y-6 w-full mx-auto p-4 lg:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-orange-600">
            ISP Profile
          </h1>
          <p className="text-sm text-gray-500 mt-1">Insurance Service Provider Details</p>
        </div>
        <Button
          className="bg-primary hover:bg-secondary transition-colors duration-300"
          onClick={handleEditClick}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Details
        </Button>
      </div>

      {/* ISP Header Card */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-lg border-2 border-dashed border-orange-400 flex items-center justify-center bg-orange-50">
              <Building2 className="w-10 h-10 text-orange-600" />
            </div>

            <div>
              <p className="text-xs text-gray-500 mt-1">INSURANCE SERVICE PROVIDER</p>
              <h2 className="text-lg font-bold text-primary">{isp.ispName}</h2>
              <div className="flex items-center gap-3 mt-2">
                <Badge className="bg-secondary text-xs uppercase text-white px-3">
                  {isp.ispCode}
                </Badge>
                <Badge className="bg-orange-100 text-orange-800 text-xs">
                  {isp.ispType}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 border-l-2 border-dashed pl-4 border-secondary/40">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Approval Status:</span>
              <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300">
                Pending Approval
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <Badge variant="secondary" className="bg-gray-200 text-gray-700">
                Inactive
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* ISP Details */}
      <div className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">ISP Information</h2>
          <div className="h-px bg-secondary mt-2 w-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-sm font-semibold text-primary">Legal Name:</p>
            <p className="font-normal text-gray-900">{isp.ispLegalName}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">Registration No.:</p>
            <p className="font-normal text-gray-900">{isp.registrationNumber}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">Tax PIN:</p>
            <p className="font-normal text-gray-900">{isp.taxIdentificationNumber}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">Country:</p>
            <p className="font-normal text-gray-900">{isp.country}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">ISP Type:</p>
            <p className="font-normal text-gray-900">{isp.ispType}</p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Contact Information
          </h2>
          <div className="h-px bg-secondary mt-2 w-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <p className="text-sm font-semibold text-primary">Email Address:</p>
            <a href={`mailto:${isp.email}`} className="font-normal text-gray-900 hover:underline break-all">
              {isp.email}
            </a>
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">Primary Phone:</p>
            <p className="font-normal text-gray-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              {isp.phonePrimary}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">Secondary Phone:</p>
            <p className="font-normal text-gray-900">{isp.phoneSecondary || "—"}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">Website:</p>
            <Link
              href={`https://${isp.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-normal text-primary hover:underline flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              {isp.website}
            </Link>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Address Information
          </h2>
          <div className="h-px bg-secondary mt-2 w-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-sm font-semibold text-primary">Physical Address:</p>
            <p className="font-normal text-gray-900">{isp.physicalAddress}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">Postal Address:</p>
            <p className="font-normal text-gray-900">{isp.postalAddress}</p>
          </div>
        </div>
      </div>

      {/* Licenses */}
      <div className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Licenses ({licenses.length})
          </h2>
        </div>
        <div className="h-px bg-secondary mt-2 w-full"></div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-medium text-gray-700">License Number</th>
                <th className="text-left py-3 font-medium text-gray-700">Type</th>
                <th className="text-left py-3 font-medium text-gray-700">Expiry Date</th>
                <th className="text-left py-3 font-medium text-gray-700">Days Remaining</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map((lic) => (
                <tr key={lic.licenseNumber} className="border-b hover:bg-gray-50">
                  <td className="py-4 font-medium">{lic.licenseNumber}</td>
                  <td className="py-4">
                    <Badge variant="outline" className="text-xs">
                      {lic.type}
                    </Badge>
                  </td>
                  <td className="py-4">{new Date(lic.expiry).toLocaleDateString()}</td>
                  <td className="py-4">
                    <span className={lic.daysLeft < 180 ? "text-orange-600 font-medium" : ""}>
                      {lic.daysLeft} days
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Approval Banner */}
      {isp.approvalStatus === "PENDING_APPROVAL" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 flex items-start gap-4">
          <AlertCircle className="w-10 h-10 text-yellow-600 shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-900">Approval Pending</h3>
            <p className="text-sm text-yellow-800 mt-1">
              This ISP profile is currently under review. All configurations (bank accounts, contacts, SLAs, integrations) 
              will be activated once approved by the administrator.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ISPProfile;