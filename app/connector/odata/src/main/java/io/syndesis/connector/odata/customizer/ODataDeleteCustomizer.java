/*
 * Copyright (C) 2016 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.syndesis.connector.odata.customizer;

import java.io.IOException;
import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.util.ObjectHelper;
import com.fasterxml.jackson.databind.JsonNode;

public class ODataDeleteCustomizer extends AbstractProducerCustomizer {

    @Override
    protected void beforeProducer(Exchange exchange) throws IOException {
        Message in = exchange.getIn();

        String body = in.getBody(String.class);
        JsonNode node = OBJECT_MAPPER.readTree(body);
        JsonNode keyPredicateNode = node.get(KEY_PREDICATE);

        if (! ObjectHelper.isEmpty(keyPredicateNode)) {
            String keyPredicate = keyPredicateNode.asText();
            in.setHeader(OLINGO4_PROPERTY_PREFIX + KEY_PREDICATE, keyPredicate);
        }

        in.setBody(EMPTY_STRING);
    }
}
