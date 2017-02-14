/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
 * Salesforce DTO generated by camel-salesforce-maven-plugin
 * Generated on: Thu Feb 09 14:29:57 CET 2017
 */
package org.foo.salesforce.upsert.contact;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Salesforce Enumeration DTO for picklist MailingGeocodeAccuracy
 */
public enum Contact_MailingGeocodeAccuracyEnum {

    // Address
    ADDRESS("Address"),
    // Block
    BLOCK("Block"),
    // City
    CITY("City"),
    // County
    COUNTY("County"),
    // ExtendedZip
    EXTENDEDZIP("ExtendedZip"),
    // NearAddress
    NEARADDRESS("NearAddress"),
    // Neighborhood
    NEIGHBORHOOD("Neighborhood"),
    // State
    STATE("State"),
    // Street
    STREET("Street"),
    // Unknown
    UNKNOWN("Unknown"),
    // Zip
    ZIP("Zip");

    final String value;

    private Contact_MailingGeocodeAccuracyEnum(String value) {
        this.value = value;
    }

    @JsonValue
    public String value() {
        return this.value;
    }

    @JsonCreator
    public static Contact_MailingGeocodeAccuracyEnum fromValue(String value) {
        for (Contact_MailingGeocodeAccuracyEnum e : Contact_MailingGeocodeAccuracyEnum.values()) {
            if (e.value.equals(value)) {
                return e;
            }
        }
        throw new IllegalArgumentException(value);
    }

}
