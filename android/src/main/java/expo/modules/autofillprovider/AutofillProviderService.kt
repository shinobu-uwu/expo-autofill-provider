package expo.modules.autofillprovider
import android.app.assist.AssistStructure
import android.service.autofill.AutofillService
import android.service.autofill.FillCallback
import android.service.autofill.FillRequest
import android.service.autofill.SaveCallback
import android.service.autofill.SaveRequest
import android.view.autofill.AutofillId
import android.os.CancellationSignal
import android.service.autofill.Dataset
import android.service.autofill.FillResponse
import android.view.View
import android.view.autofill.AutofillValue
import android.widget.RemoteViews

class AutofillProviderService : AutofillService() {

    override fun onFillRequest(request: FillRequest, cancellationSignal: CancellationSignal, callback: FillCallback) {
        val structure = request.fillContexts.last().structure
        val foundIds = parseStructure(structure)

        if (!foundIds.hasAny()) {
            callback.onSuccess(null)
            return
        }

        val responseBuilder = FillResponse.Builder()

        // Create the presentation based on what we found
        val label = when {
            foundIds.passwordId != null && foundIds.usernameId != null -> "Fill Login"
            foundIds.passwordId != null -> "Fill Password"
            else -> "Fill Username/Email"
        }

        val presentation = RemoteViews(packageName, android.R.layout.simple_list_item_1).apply {
            setTextViewText(android.R.id.text1, "$label (Mock)")
        }

        val datasetBuilder = Dataset.Builder()

        if (foundIds.usernameId != null && foundIds.passwordId != null) {
            datasetBuilder.setValue(foundIds.usernameId, AutofillValue.forText("mock_user@example.com"), presentation)
            datasetBuilder.setValue(foundIds.passwordId, AutofillValue.forText("mock_password_123"), presentation)
        } else if (foundIds.usernameId != null) {
            datasetBuilder.setValue(foundIds.usernameId, AutofillValue.forText("mock_user@example.com"), presentation)
        } else if (foundIds.passwordId != null) {
            datasetBuilder.setValue(foundIds.passwordId, AutofillValue.forText("mock_password_123"), presentation)
        }

        responseBuilder.addDataset(datasetBuilder.build())
        callback.onSuccess(responseBuilder.build())
    }

    override fun onSaveRequest(p0: SaveRequest, p1: SaveCallback) {

    }
    private fun parseStructure(structure: AssistStructure): AutofillFieldIds {
        var usernameId: AutofillId? = null
        var passwordId: AutofillId? = null

        val nodes = (0 until structure.windowNodeCount).map {
            structure.getWindowNodeAt(it).rootViewNode
        }

        fun traverse(node: AssistStructure.ViewNode) {
            val hints = node.autofillHints

            // 1. Check Hints
            if (hints != null) {
                if (hints.contains(View.AUTOFILL_HINT_PASSWORD)) {
                    passwordId = node.autofillId
                } else if (hints.contains(View.AUTOFILL_HINT_USERNAME) ||
                    hints.contains(View.AUTOFILL_HINT_EMAIL_ADDRESS)) {
                    usernameId = node.autofillId
                }
            }

            // 2. Fallback: Check InputType for password if hint is missing
            if (passwordId == null && (node.inputType and android.text.InputType.TYPE_TEXT_VARIATION_PASSWORD) != 0) {
                passwordId = node.autofillId
            }

            // 3. Fallback: Check for generic text/email fields if we still haven't found a username
            if (usernameId == null && passwordId == null && node.className?.contains("EditText") == true) {
                val type = node.inputType
                if ((type and android.text.InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS) != 0 ||
                    (type and android.text.InputType.TYPE_CLASS_TEXT) != 0) {
                    usernameId = node.autofillId
                }
            }

            for (i in 0 until node.childCount) {
                traverse(node.getChildAt(i))
            }
        }

        nodes.forEach { traverse(it) }
        return AutofillFieldIds(usernameId, passwordId, isLoginScreen = passwordId != null)
    }
}

data class AutofillFieldIds(
    val usernameId: AutofillId? = null,
    val passwordId: AutofillId? = null,
    val isLoginScreen: Boolean = false
) {
    fun hasAny() = usernameId != null || passwordId != null
}
