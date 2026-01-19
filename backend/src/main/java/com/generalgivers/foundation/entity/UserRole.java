package com.generalgivers.foundation.entity;

/**
 * User roles as defined in the Generous Givers Family Constitution (Article 5.2)
 *
 * Executive Committee consists of:
 * 1. Chairperson
 * 2. Vice-Chairperson
 * 3. Secretary General
 * 4. Vice Secretary
 * 5. Treasurer
 * 6. Organizing Secretary
 * 7. Committee Members
 */
public enum UserRole {
    SUPER_USER,           // System administrator (full access)
    CHAIRPERSON,          // The Chairperson - leads the organization
    VICE_CHAIRPERSON,     // Vice-Chairperson - assumes chair duties when absent
    SECRETARY_GENERAL,    // Secretary General - maintains records & minutes
    VICE_SECRETARY,       // Vice Secretary - assists secretary
    TREASURER,            // Treasurer - manages finances
    ORGANIZING_SECRETARY, // Organizing Secretary - coordinates events
    COMMITTEE_MEMBER      // Committee Members - general support
}
