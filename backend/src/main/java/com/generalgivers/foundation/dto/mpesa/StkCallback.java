package com.generalgivers.foundation.dto.mpesa;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class StkCallback {
    @JsonProperty("Body")
    private Body body;

    @Data
    public static class Body {
        @JsonProperty("stkCallback")
        private StkCallbackContent stkCallback;
    }

    @Data
    public static class StkCallbackContent {
        @JsonProperty("MerchantRequestID")
        private String merchantRequestId;

        @JsonProperty("CheckoutRequestID")
        private String checkoutRequestId;

        @JsonProperty("ResultCode")
        private int resultCode;

        @JsonProperty("ResultDesc")
        private String resultDesc;

        @JsonProperty("CallbackMetadata")
        private CallbackMetadata callbackMetadata;

        public boolean isSuccessful() {
            return resultCode == 0;
        }
    }

    @Data
    public static class CallbackMetadata {
        @JsonProperty("Item")
        private List<CallbackItem> items;

        public String getValueByName(String name) {
            if (items == null) return null;
            return items.stream()
                    .filter(item -> name.equals(item.getName()))
                    .findFirst()
                    .map(CallbackItem::getValue)
                    .orElse(null);
        }
    }

    @Data
    public static class CallbackItem {
        @JsonProperty("Name")
        private String name;

        @JsonProperty("Value")
        private Object value;

        public String getValue() {
            return value != null ? value.toString() : null;
        }
    }
}
